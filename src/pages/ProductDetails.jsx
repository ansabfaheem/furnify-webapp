import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Star, Shield, ArrowLeft, Minus, Plus } from 'lucide-react';
import './ProductDetails.css';

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
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={18} /> Back
                </button>

                <div className="product-details-container">
                    {/* Image */}
                    <div className="product-image-wrapper">
                        <img src={product.image} alt={product.name} className="product-detail-image" />
                    </div>

                    {/* Details */}
                    <div>
                        <div className="product-meta">
                            <span className="category-badge">{product.category}</span>
                            {product.isNew && <span className="new-badge">NEW</span>}
                        </div>

                        <h1 className="product-title">{product.name}</h1>
                        <p className="product-price-large">₹{product.price.toLocaleString('en-IN')}</p>

                        <p className="product-description">
                            {product.description}
                        </p>

                        <div className="product-actions">
                            <div className="quantity-selector">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn"><Minus size={18} /></button>
                                <span className="qty-value">{quantity}</span>
                                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="qty-btn"><Plus size={18} /></button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="btn btn-primary add-to-cart-action-btn"
                            >
                                <ShoppingCart size={20} /> Add to Cart
                            </button>
                        </div>

                        <div className="product-features">
                            <div className="feature-row">
                                <Shield size={20} color="var(--color-accent)" /> 2 Year Warranty included
                            </div>
                            <div className="feature-row">
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
