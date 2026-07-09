from django.db import models
from categories.models import Category

class Product(models.Model):
    name = models.CharField(max_length=255, unique=True)
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='products'
    )
    price = models.IntegerField()
    description = models.TextField(blank=True, default='')
    image = models.ImageField(upload_to='products/', null=True, blank=True, max_length=500)
    isNew = models.BooleanField(default=False)
    stock = models.IntegerField(default=0)
    status = models.CharField(
        max_length=20,
        choices=[('active', 'active'), ('inactive', 'inactive')],
        default='active'
    )

    def __str__(self):
        return self.name
