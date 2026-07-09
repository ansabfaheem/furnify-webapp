from rest_framework import viewsets, permissions
from django.db import models
from .models import Product
from .serializers import ProductSerializer
from accounts.permissions import IsAdminUserRole

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUserRole()]
        return [permissions.AllowAny()]

    @property
    def paginator(self):
        # Disable pagination if _limit or limit is provided to allow slicing
        if '_limit' in self.request.query_params or 'limit' in self.request.query_params:
            return None
        return super().paginator

    def get_queryset(self):
        queryset = Product.objects.all()
        
        # Check name uniqueness (used by addProduct check)
        name = self.request.query_params.get('name')
        if name:
            queryset = queryset.filter(name__iexact=name)
        
        # Category filter (frontend uses category name, e.g. category=Office)
        category = self.request.query_params.get('category')
        if category and category != 'All':
            queryset = queryset.filter(category__name__iexact=category)
            
        # Search query (q or search)
        search = self.request.query_params.get('q') or self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(name__icontains=search) | 
                models.Q(description__icontains=search)
            )
            
        # Status filter
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        else:
            # Non-admin users should only see active products
            user = self.request.user
            is_admin = user.is_authenticated and hasattr(user, 'role') and user.role == 'admin'
            if not is_admin:
                queryset = queryset.filter(status='active')

        # Sorting (JSON Server style: _sort=price&_order=desc)
        sort = self.request.query_params.get('_sort') or self.request.query_params.get('ordering')
        if sort:
            order = self.request.query_params.get('_order') or self.request.query_params.get('order')
            if order == 'desc' or (isinstance(sort, str) and sort.startswith('-')):
                clean_sort = sort.lstrip('-')
                queryset = queryset.order_by(f'-{clean_sort}')
            else:
                queryset = queryset.order_by(sort)
        else:
            # Default ordering
            queryset = queryset.order_by('id')

        # Slicing (JSON Server style: _limit=4)
        limit = self.request.query_params.get('_limit') or self.request.query_params.get('limit')
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except ValueError:
                pass
                
        return queryset
