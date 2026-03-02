import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = React.useState([]);

    React.useEffect(() => {
        fetch('http://localhost:5000/products?_limit=4')
            .then(res => res.json())
            .then(data => setFeaturedProducts(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section style={{
                backgroundColor: '#F3F4F6', // Fallback color
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '120px 0',
                color: 'white',
                textAlign: 'center',
                minHeight: '600px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className="container animate-fade-in">
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', color: 'white' }}>
                        Elevate Your Living Space
                    </h1>
                    <p style={{ fontSize: '1.25rem', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px', fontWeight: '300' }}>
                        Discover our curated collection of premium furniture designed for comfort and crafted for longevity.
                    </p>
                    <Link to="/products" className="btn btn-primary" style={{ backgroundColor: 'var(--color-secondary)', border: 'none', padding: '16px 36px', fontSize: '1.1rem' }}>
                        Shop Collection
                    </Link>
                </div>
            </section>

            {/* Features/Benefits Section */}
            <section className="section-padding">
                <div className="container">
                    <div className="grid-cols-3" style={{ textAlign: 'center' }}>
                        <div style={{ padding: '30px' }}>
                            <div style={{ color: 'var(--color-secondary)', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}><Truck size={40} /></div>
                            <h3 style={{ marginBottom: '10px' }}>Fast & Free Shipping</h3>
                            <p style={{ color: 'var(--color-light-text)' }}>We deliver your furniture with care, free of charge on orders over ₹40,000.</p>
                        </div>
                        <div style={{ padding: '30px' }}>
                            <div style={{ color: 'var(--color-secondary)', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}><Shield size={40} /></div>
                            <h3 style={{ marginBottom: '10px' }}>2 Year Warranty</h3>
                            <p style={{ color: 'var(--color-light-text)' }}>Enjoy peace of mind with our comprehensive warranty on all items.</p>
                        </div>
                        <div style={{ padding: '30px' }}>
                            <div style={{ color: 'var(--color-secondary)', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}><Star size={40} /></div>
                            <h3 style={{ marginBottom: '10px' }}>Premium Materials</h3>
                            <p style={{ color: 'var(--color-light-text)' }}>Detailed craftsmanship using only the highest quality sustainable materials.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section-padding" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '40px' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Featured Collection</h2>
                            <p style={{ color: 'var(--color-light-text)' }}>Explore our most popular pieces.</p>
                        </div>
                        <Link to="/products" className="btn" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                            View All <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                        </Link>
                    </div>

                    <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
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
