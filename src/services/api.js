const API_URL = 'http://localhost:8000/api';

const getHeaders = (extraHeaders = {}) => {
    const token = localStorage.getItem('furnify_token');
    const headers = { ...extraHeaders };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    // Products
    getProducts: async (category, limit) => {
        let url = `${API_URL}/products/`;
        const params = [];
        if (category && category !== 'All') {
            params.push(`category=${encodeURIComponent(category)}`);
        }
        if (limit) {
            params.push(`_limit=${limit}`);
        }
        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }
        const res = await fetch(url);
        return res.json();
    },
    getProductById: async (id) => {
        const res = await fetch(`${API_URL}/products/${id}/`);
        return res.json();
    },
    addProduct: async (productData) => {
        // Prevent duplicate product names
        const check = await fetch(`${API_URL}/products/?name=${encodeURIComponent(productData.name)}`);
        const existing = await check.json();
        if (existing.length > 0) throw new Error('Product with this name already exists');

        const res = await fetch(`${API_URL}/products/`, {
            method: 'POST',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(productData),
        });
        return res.json();
    },
    updateProduct: async (id, productData) => {
        const res = await fetch(`${API_URL}/products/${id}/`, {
            method: 'PATCH',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(productData),
        });
        return res.json();
    },

    // Auth & Users
    login: async (email, password) => {
        const res = await fetch('http://localhost:8000/api/accounts/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || err.non_field_errors?.[0] || 'Invalid email or password');
        }
        
        const data = await res.json();
        localStorage.setItem('furnify_token', data.access);
        localStorage.setItem('furnify_refresh', data.refresh);
        return data.user;
    },
    register: async (userData) => {
        // Check if user exists
        const check = await fetch(`${API_URL}/accounts/check-email/?email=${encodeURIComponent(userData.email)}`);
        const existing = await check.json();
        if (existing.length > 0) throw new Error('User already exists');

        const res = await fetch('http://localhost:8000/api/accounts/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...userData }),
        });
        
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.email?.[0] || 'Registration failed');
        }
        
        const data = await res.json();
        localStorage.setItem('furnify_token', data.access);
        localStorage.setItem('furnify_refresh', data.refresh);
        return data.user;
    },
    getUsers: async () => {
        const res = await fetch(`${API_URL}/users/`, {
            headers: getHeaders(),
        });
        return res.json();
    },
    updateUser: async (id, userData) => {
        const res = await fetch(`${API_URL}/users/${id}/`, {
            method: 'PATCH',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(userData),
        });
        return res.json();
    },

    // Cart
    getCart: async (userId) => {
        const res = await fetch(`${API_URL}/carts/?userId=${userId}`, {
            headers: getHeaders(),
        });
        const carts = await res.json();
        return carts.length > 0 ? carts[0] : null;
    },
    createCart: async (userId) => {
        const res = await fetch(`${API_URL}/carts/`, {
            method: 'POST',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ userId, items: [] }),
        });
        return res.json();
    },
    updateCart: async (cartId, items) => {
        const res = await fetch(`${API_URL}/carts/${cartId}/`, {
            method: 'PATCH',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ items }),
        });
        return res.json();
    },

    // Orders
    getOrders: async (userId) => {
        const res = await fetch(`${API_URL}/orders/?userId=${userId}`, {
            headers: getHeaders(),
        });
        return res.json();
    },
    createOrder: async (orderData) => {
        const res = await fetch(`${API_URL}/orders/`, {
            method: 'POST',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(orderData),
        });
        return res.json();
    }
};
