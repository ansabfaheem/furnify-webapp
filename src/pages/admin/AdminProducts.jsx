import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { api } from '../../services/api';
import './AdminProducts.css';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    
    // Form State
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formError, setFormError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        category: 'Living Room',
        price: '',
        description: '',
        image: '/images/default_product.png',
        stock: '',
        isNew: true,
        status: 'active'
    });

    const categories = ['All', 'Office', 'Living Room', 'Bedroom', 'Dining', 'Decor'];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await api.getProducts('All');
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleOpenForm = (product = null) => {
        setFormError('');
        if (product) {
            setIsEditing(true);
            setFormData(product);
        } else {
            setIsEditing(false);
            setFormData({
                name: '',
                category: 'Living Room',
                price: '',
                description: '',
                image: '/images/default_product.png',
                stock: '',
                isNew: true,
                status: 'active'
            });
        }
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        // Basic validation
        if (!formData.name || !formData.price || !formData.category) {
            setFormError('Name, price, and category are required.');
            return;
        }

        const productData = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            status: formData.status || 'active'
        };

        try {
            if (isEditing) {
                await api.updateProduct(formData.id, productData);
            } else {
                await api.addProduct({ ...productData, id: String(Date.now()) });
            }
            setShowForm(false);
            fetchProducts();
        } catch (error) {
            setFormError(error.message || 'Failed to save product');
        }
    };

    const handleSoftDelete = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'inactive' ? 'active' : 'inactive';
            await api.updateProduct(id, { status: newStatus });
            fetchProducts();
        } catch (error) {
            console.error('Failed to update product status', error);
        }
    };

    // Filtering logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="admin-products-container">
            <div className="admin-products-header">
                <h2>Products Inventory</h2>
                <button className="btn btn-primary add-product-btn" onClick={() => handleOpenForm()}>
                    <Plus size={18} /> Add New Product
                </button>
            </div>

            <div className="admin-controls">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-box">
                    <select 
                        value={categoryFilter} 
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading products...</div>
            ) : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price (₹)</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id} className={product.status === 'inactive' ? 'inactive-row' : ''}>
                                    <td>
                                        <img src={product.image} alt={product.name} className="product-thumbnail" />
                                    </td>
                                    <td>
                                        <div className="product-name">{product.name}</div>
                                        {product.isNew && <span className="badge badge-new">New</span>}
                                    </td>
                                    <td>{product.category}</td>
                                    <td>₹{product.price.toLocaleString()}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <span className={`status-badge ${product.status === 'inactive' ? 'status-inactive' : 'status-active'}`}>
                                            {product.status === 'inactive' ? 'Inactive' : 'Active'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="btn-icon edit-btn" 
                                                onClick={() => handleOpenForm(product)}
                                                title="Edit Product"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                className={`btn-icon ${product.status === 'inactive' ? 'restore-btn' : 'delete-btn'}`} 
                                                onClick={() => handleSoftDelete(product.id, product.status)}
                                                title={product.status === 'inactive' ? "Restore Product" : "Deactivate Product"}
                                            >
                                                {product.status === 'inactive' ? <Plus size={16} /> : <Trash2 size={16} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center no-data">No products found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Product Form Modal */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                            <button className="close-btn" onClick={() => setShowForm(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        {formError && <div className="error-alert">{formError}</div>}

                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Product Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange}>
                                        {categories.filter(c => c !== 'All').map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input 
                                        type="number" 
                                        name="price" 
                                        value={formData.price} 
                                        onChange={handleInputChange} 
                                        min="0"
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Stock Quantity</label>
                                    <input 
                                        type="number" 
                                        name="stock" 
                                        value={formData.stock} 
                                        onChange={handleInputChange} 
                                        min="0"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Image URL (or path)</label>
                                    <input 
                                        type="text" 
                                        name="image" 
                                        value={formData.image} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleInputChange} 
                                    rows="3"
                                />
                            </div>

                            <div className="form-row checkbox-row">
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        name="isNew" 
                                        checked={formData.isNew} 
                                        onChange={handleInputChange} 
                                    />
                                    Mark as New Arrival
                                </label>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {isEditing ? 'Save Changes' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
