from rest_framework import serializers
from .models import Review
from products.models import Product
from django.contrib.auth import get_user_model

User = get_user_model()

class ReviewSerializer(serializers.ModelSerializer):
    productId = serializers.PrimaryKeyRelatedField(source='product', queryset=Product.objects.all())
    userId = serializers.PrimaryKeyRelatedField(source='user', read_only=True)
    userName = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'productId', 'userId', 'userName', 'rating', 'comment', 'created_at')

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
