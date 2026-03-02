import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Star, Shield, ArrowLeft, Minus, Plus } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const data = await api.getProductById(id);
            setProduct(data);
        } catch (error) {
            console.error("Failed to fetch product", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        await addToCart(product, quantity);
        alert('Added to cart!');
    };

    if (loading) return <div className="text-center section-padding">Loading...</div>;
    if (!product) return <div className="text-center section-padding">Product not found</div>;

    return (
        <div className="product-details-page section-padding">
            <div className="container">
                <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', color: 'var(--color-light-text)' }}>
                    <ArrowLeft size={18} /> Back
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px' }}>
                    {/* Image */}
                    <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>

                    {/* Details */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <span style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{product.category}</span>
                            {product.isNew && <span style={{ backgroundColor: 'var(--color-secondary)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>NEW</span>}
                        </div>

                        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{product.name}</h1>
                        <p style={{ fontSize: '1.5rem', color: 'var(--color-secondary)', fontWeight: '700', marginBottom: '20px' }}>₹{product.price.toLocaleString('en-IN')}</p>

                        <p style={{ color: 'var(--color-text)', lineHeight: '1.8', marginBottom: '30px' }}>
                            {product.description}
                        </p>

                        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '10px' }}><Minus size={18} /></button>
                                <span style={{ padding: '10px 15px', fontWeight: '600' }}>{quantity}</span>
                                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} style={{ padding: '10px' }}><Plus size={18} /></button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="btn btn-primary"
                                style={{ flex: 1, gap: '10px' }}
                            >
                                <ShoppingCart size={20} /> Add to Cart
                            </button>
                        </div>

                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', display: 'grid', gap: '15px' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--color-light-text)' }}>
                                <Shield size={20} color="var(--color-accent)" /> 2 Year Warranty included
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--color-light-text)' }}>
                                <Star size={20} color="#f1c40f" /> 4.8/5 Customer Rating
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
