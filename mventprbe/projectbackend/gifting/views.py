from django.http import JsonResponse
from .models import Product, Order, OrderUpdate, Review, Contact
from django.db.models import Q, OuterRef, Subquery
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
def home(request):
    all_Prod=[]
    prod_cat=Product.objects.prefetch_related('images')
    print(prod_cat)
    for cat in prod_cat:
        all_Prod.append({"id":cat.id,"item_name": cat.item_name,"item_category": cat.item_category,"item_subcategory": cat.item_subcategory,"item_description": cat.item_description,"item_oldprice":str(cat.item_oldprice),"item_newprice":str(cat.item_newprice),"images": [img.image.url for img in cat.images.all()]})
    return JsonResponse(all_Prod, safe=False)

def searchProduct(request):
    all_prod=[]
    query = request.GET.get("q", "").strip()
    print(query)
    if not query:
        return JsonResponse([], safe=False)
    products = Product.objects.filter(Q(item_category__icontains=query) | Q(item_subcategory__icontains=query) | Q(item_name__icontains=query) | Q(item_description__icontains=query))
    for product in products:
        all_prod.append({"id":product.id,"item_name": product.item_name,"item_category": product.item_category,"item_subcategory": product.item_subcategory,"item_description": product.item_description,"item_oldprice":str(product.item_oldprice),"item_newprice":str(product.item_newprice),"images": [img.image.url for img in product.images.all()]})
    return JsonResponse(all_prod, safe=False)

def reviews(request,product_id):
    if request.method == "GET":
        reviews = Review.objects.filter(product_id=product_id).select_related('user')

        data = []
        for r in reviews:
            data.append({
                "review_no": r.review_no,
                "rating": r.rating,
                "comment": r.comment,
                "user": r.user.username,
                "review_at": r.review_at.strftime("%Y-%m-%d %H:%M")
            })

        product = Product.objects.get(id=product_id)
        average_rating = product.average_rating()

        return JsonResponse({"data":data,"average_rating":average_rating})

@permission_classes([IsAuthenticated])
def can_review(request,product_id):
    user = request.user

    has_purchased = Order.objects.filter(
        user=user,
        completed=True,     
    ).exists()

    for order in has_purchased:
        for item in order.items_json:
            if item.get("product_id") == product_id:
                return JsonResponse({"can_review": True})
            else:
                return Response({"error":"You cannot add review to this product"},status=status.HTTP_401_UNAUTHORIZED)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def addReviews(request, product_id):
    product=Product.objects.filter(id=product_id)
    comment=request.data.get("comment")
    rating=request.data.get("rating")

    if not all([product,comment,rating]):
        return Response({"error":"Missing required fields"},status=status.HTTP_400_BAD_REQUEST)
    new_review=Review.objects.create(comment=comment,rating=rating,user=request.user,product=product)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def order(request):
    items=request.data.get("items")
    price=request.data.get("price")
    name=request.data.get("name")
    email=request.data.get("email")
    phone=request.data.get("mobile")
    address1=request.data.get("address1")
    address2=request.data.get("address2","")
    state=request.data.get("state")
    city=request.data.get("city")
    pin=request.data.get("pin")
    payment_method=request.data.get("payment_method")

    if not items or not isinstance(items, list):
        return Response({"error": "Invalid cart format"}, status=400)

    validated_items = []

    for entry in items:
        product_data = entry.get("product")
        quantity = entry.get("quantity")

        if not product_data or not quantity:
            return Response({"error": "Invalid cart item"}, status=400)

        product_id = product_data.get("id")

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=400)

        validated_items.append({
            "product_id": product.id,
            "name": product.item_name,
            "subcategory":product.item_subcategory,
            "price": str(product.item_newprice),
            "quantity": quantity
        })
    
    print(request.user,price,name,email,phone,address1,state,city,pin,payment_method)

    if not all([price,name,email,phone,address1,state,city,pin,payment_method]):
        return Response({"error":"Missing required fields"},status=status.HTTP_400_BAD_REQUEST)
    
    address = f"{address1} {address2}".strip()

    new_order=Order.objects.create(user=request.user,items_json=validated_items,price_json=price,name=name,email=email,phone=phone,address=address,state=state,city=city,zip_code=pin,payment_method=payment_method)
    new_update=OrderUpdate.objects.create(order=new_order, status="placed")

    return Response({"message":"Order placed successfully"},status=status.HTTP_201_CREATED)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def myOrders(request):
    latest_update = OrderUpdate.objects.filter(
        order=OuterRef("pk")
    ).order_by("-update_at")

    orders = (
        Order.objects
        .filter(user=request.user)
        .annotate(
            latest_status=Subquery(latest_update.values("status")[:1]),
            latest_message=Subquery(latest_update.values("message")[:1]),
            latest_time=Subquery(latest_update.values("update_at")[:1]),
        )
        .order_by("-created_at")
    )

    response = []
    for o in orders:
        response.append({
            "order_id": o.order_id,
            "items": o.items_json,
            "price": o.price_json,
            "status": o.latest_status,      
            "message": o.latest_message,    
            "completed": o.completed,       
            "payment_method": o.payment_method,
            "created_at": o.created_at,
            "updated_at": o.latest_time,
        })
        print(o.order_id,o.latest_status)

    return Response(response, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def orderDetails(request, order_id):
    try:
        order=Order.objects.get(order_id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({"error":"Order not found"},status=status.HTTP_404_NOT_FOUND)
    
    updates=OrderUpdate.objects.filter(order=order).order_by("update_at")

    return Response({
        "order":{
            "order_id":order.order_id,
            "items": order.items_json,
            "price": order.price_json,
            "address": order.address,
            "city": order.city,
            "state": order.state,
            "zip_code": order.zip_code,
            "payment_method": order.payment_method,
            "completed":order.completed,
            "created_at": order.created_at,
        },
        "updates":[{"status":u.status, "message":u.message, "time":u.update_at} for u in updates]
    },status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def contact(request):
    name=request.data.get("name")
    email=request.data.get("email")
    phone=request.data.get("phone")
    issue=request.data.get("query")

    if not all([name,email,phone,issue]):
        return Response({"error":"Failed to load your Query"},status=status.HTTP_400_BAD_REQUEST)
    
    new_query=Contact.objects.create(user=request.user,name=name,email=email,phone=phone,issue=issue)

    return Response({"message":"Complaint sent successfully"},status=status.HTTP_201_CREATED)