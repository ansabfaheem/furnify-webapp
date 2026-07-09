from django.contrib import admin
from .models import Product

class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'price', 'stock', 'status', 'isNew')
    list_filter = ('category', 'status', 'isNew')
    search_fields = ('name', 'description')

admin.site.register(Product, ProductAdmin)
