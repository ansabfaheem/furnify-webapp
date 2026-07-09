import React from 'react';
import { ShoppingCart, Heart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCartAsync } from '../redux/slices/cartSlice';
import { toggleWishlist, selectIsInWishlist } from '../redux/slices/wishlistSlice';
import './ProductCard.css';

const ProductCard = ({ product, hideWishlistIcon = false, onRemove = null }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const inWishlist = useSelector(state => selectIsInWishlist(state, product.id));

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation(); // Prevent card click event
        if (!user) {
            navigate('/login', { state: { message: "Please login to add items to cart." } });
        } else {
            dispatch(addToCartAsync({ product, quantity: 1 }));
            alert("Item added to cart!");
        }
    };

    const handleWishlistClick = (e) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login', { state: { message: "Please login to save items to your wishlist." } });
        } else {
            dispatch(toggleWishlist(product));
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
                {!hideWishlistIcon && !onRemove && (
                    <button 
                        className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
                        onClick={handleWishlistClick}
                    >
                        <Heart size={20} fill={inWishlist ? '#ef4444' : 'none'} color={inWishlist ? '#ef4444' : '#64748b'} />
                    </button>
                )}
                {onRemove && (
                    <button 
                        className="wishlist-btn"
                        onClick={(e) => { e.stopPropagation(); onRemove(product); }}
                        title="Remove from Wishlist"
                    >
                        <Trash2 size={20} color="#ef4444" />
                    </button>
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
