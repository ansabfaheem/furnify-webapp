import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './Orders.css';
import { api } from '../services/api';

const Orders = () => {
    const { user } = useSelector(state => state.auth);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const data = await api.getOrders(user.id);
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        }
    };

    return (
        <div className="orders-page section-padding">
            <div className="container">
                <h1>Your Orders</h1>
                <p className="orders-intro">Thank you for shopping with us.</p>

                {orders.length === 0 ? (
                    <p>No past orders found.</p>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <span className="order-id">Order #{order.id}</span>
                                    <span className="order-date">{new Date(order.date).toLocaleDateString()}</span>
                                </div>
                                <div className="order-items">
                                    {order.items.map(item => (
                                        <div key={item.productId} className="order-item-row">
                                            <span>{item.product?.name} x {item.quantity}</span>
                                            <span>₹{(item.product?.price * item.quantity).toLocaleString('en-IN')}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="order-total-row">
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
