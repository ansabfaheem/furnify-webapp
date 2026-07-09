from rest_framework import serializers
from .models import Product
from categories.models import Category

class CategoryNameField(serializers.RelatedField):
    def to_representation(self, value):
        return value.name

    def to_internal_value(self, data):
        if not data:
            return None
        # Clean category name (e.g. strip whitespace)
        name = str(data).strip()
        if not name or name == 'All':
            return None
        category, created = Category.objects.get_or_create(name=name)
        return category

class HybridImageField(serializers.Field):
    def to_representation(self, value):
        if not value:
            return '/images/default_product.png'
        
        val_str = str(value)
        # If it's a legacy public image path (starts with /images/), return it as is
        if val_str.startswith('/images/'):
            return val_str
        
        # If it's a media file path (starts with products/ or similar)
        request = self.context.get('request')
        if request and hasattr(value, 'url'):
            return request.build_absolute_uri(value.url)
        
        if hasattr(value, 'url'):
            return value.url
            
        return val_str

    def to_internal_value(self, data):
        # If data is a string (e.g., legacy path), just save it
        if isinstance(data, str):
            return data
        # Otherwise, assume it's a file upload and return it
        return data

class ProductSerializer(serializers.ModelSerializer):
    category = CategoryNameField(queryset=Category.objects.all(), required=False, allow_null=True)
    image = HybridImageField(required=False, allow_null=True)

    class Meta:
        model = Product
        fields = ('id', 'name', 'category', 'price', 'description', 'image', 'isNew', 'stock', 'status')

    def validate_name(self, value):
        # Standard DRF validator might trigger but let's exclude the current instance when updating
        instance = self.instance
        qs = Product.objects.filter(name__iexact=value)
        if instance:
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Product with this name already exists")
        return value
