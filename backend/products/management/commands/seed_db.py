import json
import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils.dateparse import parse_datetime
from django.utils.timezone import is_aware, make_aware

from categories.models import Category
from products.models import Product
from cart.models import Cart, CartItem
from orders.models import Order, OrderItem

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database from db.json'

    def handle(self, *args, **options):
        # Locate db.json (two levels up from backend folder is project root)
        # Cwd of manage.py runs from backend directory usually
        db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../db.json'))
        
        if not os.path.exists(db_path):
            self.stdout.write(self.style.ERROR(f'Could not find db.json at {db_path}'))
            return

        self.stdout.write(self.style.WARNING(f'Seeding data from {db_path}...'))

        with open(db_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # 1. Seed Users
        users_count = 0
        user_id_map = {} # Maps legacy ID to Django User object
        for user_data in data.get('users', []):
            email = user_data.get('email')
            if not email:
                continue
                
            # Avoid duplicate seeding
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'name': user_data.get('name', ''),
                    'role': user_data.get('role', 'user'),
                    'status': user_data.get('status', 'active'),
                    'is_staff': user_data.get('role') == 'admin',
                    'is_superuser': user_data.get('role') == 'admin' and email == 'admin@gmail.com',
                }
            )
            # Always update password to match db.json (set_password hashes it)
            if created or user_data.get('password'):
                user.set_password(user_data.get('password'))
                user.save()
                
            user_id_map[str(user_data.get('id'))] = user
            users_count += 1

        self.stdout.write(self.style.SUCCESS(f'Seeded {users_count} users.'))

        # 2. Seed Categories (from products in db.json)
        categories_count = 0
        category_map = {}
        for prod_data in data.get('products', []):
            cat_name = prod_data.get('category')
            if cat_name and cat_name not in category_map:
                category, created = Category.objects.get_or_create(name=cat_name)
                category_map[cat_name] = category
                categories_count += 1

        self.stdout.write(self.style.SUCCESS(f'Seeded {categories_count} categories.'))

        # 3. Seed Products
        products_count = 0
        product_id_map = {} # Maps legacy ID to Django Product object
        for prod_data in data.get('products', []):
            name = prod_data.get('name')
            if not name:
                continue

            category = category_map.get(prod_data.get('category'))
            
            product, created = Product.objects.get_or_create(
                name=name,
                defaults={
                    'category': category,
                    'price': prod_data.get('price', 0),
                    'description': prod_data.get('description', ''),
                    'image': prod_data.get('image', ''),
                    'isNew': prod_data.get('isNew', False),
                    'stock': prod_data.get('stock', 0),
                    'status': prod_data.get('status', 'active'),
                }
            )
            product_id_map[str(prod_data.get('id'))] = product
            products_count += 1

        self.stdout.write(self.style.SUCCESS(f'Seeded {products_count} products.'))

        # 4. Seed Carts
        carts_count = 0
        for cart_data in data.get('carts', []):
            legacy_user_id = str(cart_data.get('userId'))
            user = user_id_map.get(legacy_user_id)
            if not user:
                continue

            # Get or create Cart
            cart, created = Cart.objects.get_or_create(user=user)
            # Remove any existing items to start fresh
            cart.items.all().delete()

            for item in cart_data.get('items', []):
                legacy_prod_id = str(item.get('productId'))
                product = product_id_map.get(legacy_prod_id)
                if not product:
                    continue
                CartItem.objects.create(
                    cart=cart,
                    product=product,
                    quantity=item.get('quantity', 1)
                )
            carts_count += 1

        self.stdout.write(self.style.SUCCESS(f'Seeded {carts_count} carts.'))

        # 5. Seed Orders
        orders_count = 0
        for order_data in data.get('orders', []):
            legacy_user_id = str(order_data.get('userId'))
            user = user_id_map.get(legacy_user_id)
            if not user:
                continue

            # Parse date
            raw_date = order_data.get('date')
            dt = parse_datetime(raw_date) if raw_date else None
            if dt and not is_aware(dt):
                dt = make_aware(dt)

            order = Order.objects.create(
                user=user,
                total_amount=order_data.get('totalAmount', 0),
                status=order_data.get('status', 'Paid'),
            )
            # Override date because auto_now_add=True sets it to now
            if dt:
                order.date = dt
                order.save()

            for item in order_data.get('items', []):
                legacy_prod_id = str(item.get('productId'))
                product = product_id_map.get(legacy_prod_id)
                if not product:
                    continue
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=item.get('quantity', 1),
                    price=item.get('product', {}).get('price', product.price)
                )
            orders_count += 1

        self.stdout.write(self.style.SUCCESS(f'Seeded {orders_count} orders.'))
        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))
