from rest_framework import serializers
from .models import Wishlist
from products.serializers import ProductSerializer
from products.models import Product

class WishlistSerializer(serializers.ModelSerializer):
    userId = serializers.PrimaryKeyRelatedField(source='user', read_only=True)
    products = ProductSerializer(many=True, read_only=True)
    productIds = serializers.PrimaryKeyRelatedField(
        source='products',
        queryset=Product.objects.all(),
        many=True,
        write_only=True
    )

    class Meta:
        model = Wishlist
        fields = ('id', 'userId', 'products', 'productIds')

    def update(self, instance, validated_data):
        if 'products' in validated_data:
            instance.products.set(validated_data['products'])
        return instance
