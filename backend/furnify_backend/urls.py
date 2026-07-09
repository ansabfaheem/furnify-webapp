from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from accounts.views import (
    CustomTokenObtainPairView, 
    RegisterView, 
    CheckEmailView, 
    UserViewSet,
    LogoutView
)
from categories.views import CategoryViewSet
from products.views import ProductViewSet
from cart.views import CartViewSet
from orders.views import OrderViewSet
from reviews.views import ReviewViewSet
from wishlist.views import WishlistViewSet

from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
# Plural endpoint names to align with JSON Server routes
router.register(r'users', UserViewSet, basename='user')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'carts', CartViewSet, basename='cart')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'wishlists', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Custom Authentication endpoints
    path('api/accounts/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('api/accounts/register/', RegisterView.as_view(), name='register'),
    path('api/accounts/logout/', LogoutView.as_view(), name='logout'),
    path('api/accounts/check-email/', CheckEmailView.as_view(), name='check_email'),
    path('api/accounts/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Router API endpoints
    path('api/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
