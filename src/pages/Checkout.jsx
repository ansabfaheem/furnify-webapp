import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import './Checkout.css';

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
            <div className="checkout-container">
                <h1 className="checkout-title">Checkout</h1>

                <div className="checkout-form-container">
                    <h3 className="section-title">Payment Details</h3>
                    <form onSubmit={handlePayment}>
                        <div className="form-group-mb">
                            <label className="form-label">Card Number</label>
                            <input type="text" placeholder="0000 0000 0000 0000" required className="form-input" />
                        </div>
                        <div className="card-grid">
                            <div>
                                <label className="form-label">Expiry</label>
                                <input type="text" placeholder="MM/YY" required className="form-input" />
                            </div>
                            <div>
                                <label className="form-label">CVC</label>
                                <input type="text" placeholder="123" required className="form-input" />
                            </div>
                        </div>

                        <div className="checkout-summary">
                            <div className="checkout-total">
                                <span>Total to Pay</span>
                                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary pay-btn"
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
