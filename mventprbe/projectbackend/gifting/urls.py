from django.urls import path
from .import views

urlpatterns = [
    path("",views.home, name='Home'),
    path("Search", views.searchProduct, name="Search"),
    path("order", views.order, name="Order"),
    path("myorders", views.myOrders, name="MyOrders"),
    path("orders/<order_id>", views.orderDetails, name="Updates"),
]
