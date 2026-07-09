from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Cart, CartItem
from .serializers import CartSerializer

class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.query_params.get('userId')
        # If admin is checking or if filtering by userId
        if user_id:
            return Cart.objects.filter(user_id=user_id)
        return Cart.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        # Override to prevent duplicate OneToOne Cart creation
        user_id = request.data.get('userId')
        if not user_id:
            user_id = request.user.id
            
        cart, created = Cart.objects.get_or_create(user_id=user_id)
        serializer = self.get_serializer(cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
