import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Mock Payment Delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create Order
        const orderData = {
            userId: user.id,
            items: cart,
            totalAmount: cartTotal,
            date: new Date().toISOString(),
            status: 'Paid'
        };

        await api.createOrder(orderData);
        await clearCart();

        setLoading(false);
        navigate('/orders');
    };

    if (cart.length === 0) return <div className="text-center section-padding">Cart is empty</div>;

    return (
        <div className="checkout-page section-padding">
            <div className="container" style={{ maxWidth: '600px' }}>
                <h1 className="text-center" style={{ marginBottom: '30px' }}>Checkout</h1>

                <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
                    <h3 style={{ marginBottom: '20px' }}>Payment Details</h3>
                    <form onSubmit={handlePayment}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Card Number</label>
                            <input type="text" placeholder="0000 0000 0000 0000" required style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Expiry</label>
                                <input type="text" placeholder="MM/YY" required style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px' }}>CVC</label>
                                <input type="text" placeholder="123" required style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', marginBottom: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.2rem' }}>
                                <span>Total to Pay</span>
                                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : `Pay ₹${cartTotal.toLocaleString('en-IN')}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
