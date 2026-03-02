import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Filter, ArrowUpDown } from 'lucide-react';
import { api } from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortOption, setSortOption] = useState('default');
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';
    const [searchQuery, setSearchQuery] = useState(initialSearch);

    // Fetch products whenever the activeCategory changes
    useEffect(() => {
        fetchProducts(activeCategory);
    }, [activeCategory]);

    // Update internal search state if URL param changes
    useEffect(() => {
        setSearchQuery(searchParams.get('search') || '');
    }, [searchParams]);

    const fetchProducts = async (category) => {
        setLoading(true);
        try {
            const data = await api.getProducts(category);
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', 'Office', 'Living Room', 'Bedroom', 'Dining', 'Decor'];

    // Client-side search and sorting only (Category is now handled by API)
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    // Sort Logic
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortOption === 'lowToHigh') return a.price - b.price;
        if (sortOption === 'highToLow') return b.price - a.price;
        return 0; // default
    });

    return (
        <div className="products-page">
            <div className="section-padding" style={{ paddingBottom: '40px', backgroundColor: '#F3F4F6' }}>
                <div className="container">
                    <h1 className="text-center" style={{ marginBottom: '20px' }}>Our Collection</h1>
                    <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-light-text)' }}>
                        Design your dream home with our exclusive range of high-quality furniture and decor.
                    </p>
                </div>
            </div>

            <div className="section-padding">
                <div className="container">
                    {/* Controls Bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>

                        {/* Search & Sort Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
                            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ width: '100%', padding: '10px 15px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ArrowUpDown size={18} />
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    style={{ padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                >
                                    <option value="default">Sort by: Featured</option>
                                    <option value="lowToHigh">Price: Low to High</option>
                                    <option value="highToLow">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)' }}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        backgroundColor: activeCategory === cat ? 'var(--color-primary)' : 'transparent',
                                        color: activeCategory === cat ? 'white' : 'var(--color-text)',
                                        border: activeCategory === cat ? 'none' : '1px solid var(--color-border)',
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="text-center">Loading products...</div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
                            {sortedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {!loading && sortedProducts.length === 0 && (
                        <div className="text-center" style={{ padding: '60px 0' }}>
                            <h3>No products found.</h3>
                            <p>Try adjusting your search or filters.</p>
                            <button
                                className="btn btn-secondary"
                                style={{ marginTop: '20px' }}
                                onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
