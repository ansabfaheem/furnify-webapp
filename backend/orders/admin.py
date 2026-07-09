from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_amount', 'date', 'status')
    list_filter = ('status', 'date')
    search_fields = ('user__email', 'id')
    inlines = [OrderItemInline]

admin.site.register(Order, OrderAdmin)
