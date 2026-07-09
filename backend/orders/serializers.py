from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product
from products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    productId = serializers.PrimaryKeyRelatedField(source='product', queryset=Product.objects.all())
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ('productId', 'quantity', 'product')

class OrderSerializer(serializers.ModelSerializer):
    userId = serializers.PrimaryKeyRelatedField(source='user', read_only=True)
    totalAmount = serializers.IntegerField(source='total_amount')
    items = OrderItemSerializer(many=True)
    date = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'userId', 'items', 'totalAmount', 'date', 'status')

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # User is taken from the request context (or validated_data if provided by custom view)
        user = self.context['request'].user
        
        order = Order.objects.create(
            user=user,
            total_amount=validated_data['total_amount'],
            status=validated_data.get('status', 'Paid')
        )
        
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            
            # Reduce product stock if enough is available
            if product.stock >= quantity:
                product.stock -= quantity
                product.save()
            
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price
            )
            
        return order
