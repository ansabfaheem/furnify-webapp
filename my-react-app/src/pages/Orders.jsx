import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        // In a real app we would have an API endpoint for orders by user
        // For json-server we can filter
        const res = await fetch(`http://localhost:5000/orders?userId=${user.id}`);
        const data = await res.json();
        setOrders(data);
    };

    return (
        <div className="orders-page section-padding">
            <div className="container">
                <h1>Your Orders</h1>
                <p style={{ marginBottom: '40px', color: 'var(--color-light-text)' }}>Thank you for shopping with us.</p>

                {orders.length === 0 ? (
                    <p>No past orders found.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {orders.map(order => (
                            <div key={order.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                                    <span style={{ fontWeight: '600' }}>Order #{order.id}</span>
                                    <span style={{ color: 'var(--color-light-text)' }}>{new Date(order.date).toLocaleDateString()}</span>
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    {order.items.map(item => (
                                        <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' }}>
                                            <span>{item.product?.name} x {item.quantity}</span>
                                            <span>₹{(item.product?.price * item.quantity).toLocaleString('en-IN')}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', color: 'var(--color-secondary)' }}>
                                    <span>Total</span>
                                    <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
