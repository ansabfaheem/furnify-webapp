import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Filter, ArrowUpDown } from 'lucide-react';
import { api } from '../services/api';
import './Products.css';

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
            <div className="section-padding products-header">
                <div className="container">
                    <h1 className="products-title">Our Collection</h1>
                    <p className="products-subtitle">
                        Design your dream home with our exclusive range of high-quality furniture and decor.
                    </p>
                </div>
            </div>

            <div className="section-padding">
                <div className="container">
                    {/* Controls Bar */}
                    <div className="controls-bar">

                        {/* Search & Sort Row */}
                        <div className="search-sort-row">
                            <div className="search-container">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                            </div>

                            <div className="sort-container">
                                <ArrowUpDown size={18} />
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="sort-select"
                                >
                                    <option value="default">Sort by: Featured</option>
                                    <option value="lowToHigh">Price: Low to High</option>
                                    <option value="highToLow">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="category-filter">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
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
                        <div className="products-grid">
                            {sortedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {!loading && sortedProducts.length === 0 && (
                        <div className="no-products-container">
                            <h3>No products found.</h3>
                            <p>Try adjusting your search or filters.</p>
                            <button
                                className="btn btn-secondary clear-filters-btn"
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
