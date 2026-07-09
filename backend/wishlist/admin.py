from django.contrib import admin
from .models import Wishlist

class WishlistAdmin(admin.ModelAdmin):
    list_display = ('id', 'user')
    filter_horizontal = ('products',)

admin.site.register(Wishlist, WishlistAdmin)
