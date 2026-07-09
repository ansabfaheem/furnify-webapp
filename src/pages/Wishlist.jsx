import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { addToCartAsync } from '../redux/slices/cartSlice';
import { Trash2, ShoppingCart } from 'lucide-react';
import './Wishlist.css';

const Wishlist = () => {
    const dispatch = useDispatch();
    const wishlist = useSelector(state => state.wishlist.items);

    const handleAddToCart = (product) => {
        dispatch(addToCartAsync({ product, quantity: 1 }));
        dispatch(toggleWishlist(product));
        alert("Item moved to cart!");
    };

    if (wishlist.length === 0) {
        return (
            <div className="wishlist-empty-state section-padding">
                <div className="container text-center">
                    <h2>Your Wishlist is Empty</h2>
                    <p>Explore our collection and add items you love to your wishlist.</p>
                    <Link to="/products" className="btn btn-primary mt-4">Browse Products</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page section-padding">
            <div className="container">
                <h1 className="wishlist-title">My Wishlist ({wishlist.length} Items)</h1>
                
                <div className="wishlist-list sideways-list">
                    {wishlist.map((product) => (
                        <div key={product.id} className="sideways-item">
                            <Link to={`/product/${product.id}`} className="sideways-img-link">
                                <img src={product.image} alt={product.name} className="sideways-image" />
                            </Link>
                            
                            <div className="sideways-details">
                                <Link to={`/product/${product.id}`} className="sideways-name">{product.name}</Link>
                                <p className="sideways-price">₹{product.price.toLocaleString('en-IN')}</p>
                            </div>

                            <div className="sideways-actions">
                                <button 
                                    onClick={() => handleAddToCart(product)} 
                                    className="btn btn-outline sideways-add-btn"
                                    title="Add to Cart"
                                >
                                    <ShoppingCart size={18} /> <span className="sideways-btn-text">Move to Cart</span>
                                </button>
                                <button 
                                    onClick={() => dispatch(toggleWishlist(product))} 
                                    className="sideways-remove-btn"
                                    title="Remove from wishlist"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
