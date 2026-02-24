from django.db import models
from tinymce.models import HTMLField
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Avg

# Create your models here.
class Product(models.Model):
    item_category=models.CharField(max_length=100)
    item_subcategory=models.CharField(max_length=100)
    item_name=models.CharField(max_length=150)
    item_oldprice=models.DecimalField(max_digits=10, decimal_places=2)
    item_newprice=models.DecimalField(max_digits=10, decimal_places=2)
    item_description=HTMLField()
    item_instock=models.BooleanField(default=True)

    def average_rating(self):
        return self.review_set.aggregate(Avg('rating'))['rating__avg'] or 0

    def __str__(self):
        return f"{self.id}. {self.item_name}"
    
class ProductMedia(models.Model):
    item=models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)
    image=models.FileField(upload_to='products/')

    def __str__(self):
        return f"{self.item.item_name} Image"
    
class Order(models.Model):
    order_id=models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    items_json=models.JSONField()
    price_json=models.DecimalField(default=0, max_digits=9, decimal_places=2)
    name=models.CharField(max_length=70)
    email=models.EmailField()
    phone=models.IntegerField(default="")
    address=models.TextField()
    city=models.CharField(max_length=100,default="")
    state=models.CharField(max_length=100,default="")
    zip_code=models.IntegerField(default="")
    payment_method=models.CharField(max_length=50, default="")
    completed=models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order_id}. {self.user}"
    
class OrderUpdate(models.Model):
    STATUS_CHOICES = [
        ("placed", "Order Placed"),
        ("packed", "Packed"),
        ("shipped", "Shipped"),
        ("out_for_delivery", "Out for Delivery"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]
    order=models.ForeignKey(Order, on_delete=models.CASCADE, related_name="updates")
    status=models.CharField(max_length=50, choices=STATUS_CHOICES)
    message=models.TextField(blank=True)
    update_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order.order_id}. ({self.order.user}) --> {self.status}"
    
class Review(models.Model):
    review_no=models.AutoField(primary_key=True)
    comment=models.TextField()
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating from 1 to 5 stars"
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product=models.ForeignKey(Product, on_delete=models.CASCADE)
    review_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.review_no}. {self.user} for {self.product.item_name[:75]}..."
    
class Contact(models.Model):
    issue_id=models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name=models.CharField(max_length=50)
    email=models.CharField(max_length=50,default="")
    phone=models.IntegerField(default="")
    issue=models.CharField(max_length=900,default="")
    
    def __str__(self):
        return f"{self.issue_id}. {self.user}"
    
