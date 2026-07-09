from rest_framework import serializers
from .models import Cart, CartItem
from products.models import Product
from products.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):
    productId = serializers.PrimaryKeyRelatedField(source='product', queryset=Product.objects.all())
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ('productId', 'quantity', 'product')

    def to_internal_value(self, data):
        # Allow the frontend to pass 'productId' directly
        internal_data = super().to_internal_value(data)
        return internal_data

class CartSerializer(serializers.ModelSerializer):
    userId = serializers.PrimaryKeyRelatedField(source='user', read_only=True)
    items = CartItemSerializer(many=True, required=False)

    class Meta:
        model = Cart
        fields = ('id', 'userId', 'items')

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        if items_data is not None:
            # Recreate items in a simple transaction-like fashion
            instance.items.all().delete()
            for item_data in items_data:
                CartItem.objects.create(
                    cart=instance,
                    product=item_data['product'],
                    quantity=item_data.get('quantity', 1)
                )
        return super().update(instance, validated_data)
