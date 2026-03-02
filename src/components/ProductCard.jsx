import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation(); // Prevent card click event
        if (!user) {
            navigate('/login', { state: { message: "Please login to add items to cart." } });
        } else {
            addToCart(product);
            // Optional: Add visual feedback (toast/alert) here
            alert("Item added to cart!");
        }
    };

    return (
        <div
            className="product-card"
            onClick={handleCardClick}
        >
            <div className="product-image-container">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                />
                {product.isNew && (
                    <span className="product-badge-new">
                        NEW
                    </span>
                )}
            </div>
            <div className="product-info">
                <p className="product-category">{product.category}</p>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-card-footer">
                    <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
                    <button
                        className="add-to-cart-btn"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
