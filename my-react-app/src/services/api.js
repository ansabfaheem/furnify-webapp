const API_URL = 'http://localhost:5000';

export const api = {
    // Products
    getProducts: async (category) => {
        let url = `${API_URL}/products`;
        if (category && category !== 'All') {
            url += `?category=${category}`;
        }
        const res = await fetch(url);
        return res.json();
    },
    getProductById: async (id) => {
        const res = await fetch(`${API_URL}/products/${id}`);
        return res.json();
    },

    // Auth
    login: async (email, password) => {
        const res = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
        const users = await res.json();
        return users.length > 0 ? users[0] : null;
    },
    register: async (userData) => {
        // Check if user exists
        const check = await fetch(`${API_URL}/users?email=${userData.email}`);
        const existing = await check.json();
        if (existing.length > 0) throw new Error('User already exists');

        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...userData, role: 'user' }), // Default role
        });
        return res.json();
    },

    // Cart
    getCart: async (userId) => {
        const res = await fetch(`${API_URL}/carts?userId=${userId}`);
        const carts = await res.json();
        return carts.length > 0 ? carts[0] : null;
    },
    createCart: async (userId) => {
        const res = await fetch(`${API_URL}/carts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, items: [] }),
        });
        return res.json();
    },
    updateCart: async (cartId, items) => {
        const res = await fetch(`${API_URL}/carts/${cartId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
        });
        return res.json();
    },

    // Orders
    createOrder: async (orderData) => {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        return res.json();
    }
};
