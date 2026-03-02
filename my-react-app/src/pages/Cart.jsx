import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    return (
        <div className="cart-page section-padding" style={{ minHeight: '60vh' }}>
            <div className="container">
                <h1 style={{ marginBottom: '30px' }}>Your Shopping Cart</h1>

                {cart.length === 0 ? (
                    <div className="text-center" style={{ padding: '40px', backgroundColor: '#F3F4F6', borderRadius: 'var(--radius-lg)' }}>
                        <h2>Your cart is empty</h2>
                        <p style={{ margin: '20px 0' }}>Looks like you haven't added anything yet.</p>
                        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repea(auto-fit, minmax(300px, 1fr))', gap: '40px', md: { gridTemplateColumns: '2fr 1fr' } }}>
                        {/* Note: Simplified grid for inline styles, realistically use CSS Grid or Flex with media queries */}
                        <div style={{ flex: 2 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {cart.map(item => (
                                    <div key={item.productId} style={{ display: 'flex', gap: '20px', backgroundColor: 'white', padding: '20px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', alignItems: 'center' }}>
                                        <img src={item.product?.image} alt={item.product?.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />

                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '1.1rem' }}>{item.product?.name}</h3>
                                            <p style={{ color: 'var(--color-secondary)', fontWeight: '600' }}>₹{item.product?.price.toLocaleString('en-IN')}</p>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <button onClick={() => updateQuantity(item.productId, -1)} style={{ padding: '5px', backgroundColor: '#F3F4F6', borderRadius: '4px' }}><Minus size={16} /></button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.productId, 1)} style={{ padding: '5px', backgroundColor: '#F3F4F6', borderRadius: '4px' }}><Plus size={16} /></button>
                                        </div>

                                        <button onClick={() => removeFromCart(item.productId)} style={{ color: '#e74c3c' }}><Trash2 size={20} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', position: 'sticky', top: '100px' }}>
                                <h3 style={{ marginBottom: '20px' }}>Order Summary</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.2rem', marginBottom: '30px' }}>
                                    <span>Total</span>
                                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="btn btn-primary"
                                    style={{ width: '100%', justifyContent: 'space-between' }}
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
