from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from categories.models import Category
from products.models import Product

class ProductAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category1 = Category.objects.create(name="Living Room")
        self.category2 = Category.objects.create(name="Office")
        
        self.product1 = Product.objects.create(
            name="Green Velvet Armchair",
            category=self.category1,
            price=15000,
            description="Cozy chair",
            stock=10,
            status="active"
        )
        self.product2 = Product.objects.create(
            name="Black Office Chair",
            category=self.category2,
            price=11000,
            description="Ergonomic office chair",
            stock=5,
            status="active"
        )

    def test_list_products(self):
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify both products are returned
        self.assertEqual(len(response.data), 2)

    def test_filter_by_category(self):
        response = self.client.get('/api/products/', {'category': 'Office'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Black Office Chair")

    def test_search_products(self):
        response = self.client.get('/api/products/', {'q': 'Ergonomic'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Black Office Chair")
