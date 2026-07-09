from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Wishlist
from .serializers import WishlistSerializer

class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.query_params.get('userId')
        if user_id:
            return Wishlist.objects.filter(user_id=user_id)
        return Wishlist.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        # Allow get_or_create logic on detail view
        user = request.user
        wishlist, created = Wishlist.objects.get_or_create(user=user)
        serializer = self.get_serializer(wishlist)
        return Response(serializer.data)
