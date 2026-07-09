from rest_framework import viewsets, permissions
from .models import Category
from .serializers import CategorySerializer
from accounts.permissions import IsAdminUserRole

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUserRole()]
        return [permissions.AllowAny()]
