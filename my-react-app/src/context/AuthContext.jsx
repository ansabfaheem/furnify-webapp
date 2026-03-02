import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('furnify_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const userData = await api.login(email, password);
        if (userData) {
            setUser(userData);
            localStorage.setItem('furnify_user', JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const register = async (name, email, password) => {
        try {
            const newUser = await api.register({ name, email, password });
            setUser(newUser);
            localStorage.setItem('furnify_user', JSON.stringify(newUser));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('furnify_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
