import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    return (
        <div className="cart-page section-padding">
            <div className="container">
                <h1 className="cart-title">Your Shopping Cart</h1>

                {cart.length === 0 ? (
                    <div className="empty-cart-container">
                        <h2>Your cart is empty</h2>
                        <p className="empty-cart-message">Looks like you haven't added anything yet.</p>
                        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        {/* Note: Simplified grid for inline styles, realistically use CSS Grid or Flex with media queries */}
                        <div className="cart-items-column">
                            <div className="cart-items-list">
                                {cart.map(item => (
                                    <div key={item.productId} className="cart-item">
                                        <img src={item.product?.image} alt={item.product?.name} className="cart-item-image" />

                                        <div className="cart-item-details">
                                            <h3 className="cart-item-name">{item.product?.name}</h3>
                                            <p className="cart-item-price">₹{item.product?.price.toLocaleString('en-IN')}</p>
                                        </div>

                                        <div className="cart-item-actions">
                                            <button onClick={() => updateQuantity(item.productId, -1)} className="qty-control-btn"><Minus size={16} /></button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.productId, 1)} className="qty-control-btn"><Plus size={16} /></button>
                                        </div>

                                        <button onClick={() => removeFromCart(item.productId)} className="remove-item-btn"><Trash2 size={20} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cart-summary-column">
                            <div className="cart-summary-card">
                                <h3 className="summary-title">Order Summary</h3>
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="summary-total">
                                    <span>Total</span>
                                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="btn btn-primary checkout-btn"
                                >
                                    Proceed to Checkout <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
