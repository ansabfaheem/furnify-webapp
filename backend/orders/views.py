from rest_framework import viewsets, permissions
from .models import Order
from .serializers import OrderSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            user_id = self.request.query_params.get('userId')
            if user_id:
                return Order.objects.filter(user_id=user_id).order_by('-date')
            return Order.objects.all().order_by('-date')
        return Order.objects.filter(user=user).order_by('-date')
