import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/products?_limit=4')
            .then(res => res.json())
            .then(data => setFeaturedProducts(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container animate-fade-in">
                    <h1 className="hero-title">
                        Elevate Your Living Space
                    </h1>
                    <p className="hero-subtitle">
                        Discover our curated collection of premium furniture designed for comfort and crafted for longevity.
                    </p>
                    <Link to="/products" className="btn btn-primary hero-btn">
                        Shop Collection
                    </Link>
                </div>
            </section>

            {/* Features/Benefits Section */}
            <section className="section-padding">
                <div className="container">
                    <div className="grid-cols-3 features-grid">
                        <div className="feature-item">
                            <div className="feature-icon"><Truck size={40} /></div>
                            <h3 className="feature-title">Fast & Free Shipping</h3>
                            <p className="feature-desc">We deliver your furniture with care, free of charge on orders over ₹40,000.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><Shield size={40} /></div>
                            <h3 className="feature-title">2 Year Warranty</h3>
                            <p className="feature-desc">Enjoy peace of mind with our comprehensive warranty on all items.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><Star size={40} /></div>
                            <h3 className="feature-title">Premium Materials</h3>
                            <p className="feature-desc">Detailed craftsmanship using only the highest quality sustainable materials.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section-padding featured-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Featured Collection</h2>
                            <p className="section-subtitle">Explore our most popular pieces.</p>
                        </div>
                        <Link to="/products" className="btn view-all-link">
                            View All <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                        </Link>
                    </div>

                    <div className="product-grid">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>


        </div>
    );
};

export default Home;
