from django.contrib import admin
from .models import Product, ProductMedia, Order, OrderUpdate, Review

# Register your models here.
class ProductMediaInline(admin.TabularInline):
    model = ProductMedia
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductMediaInline]

admin.site.register(Order)
admin.site.register(OrderUpdate)
admin.site.register(Review)