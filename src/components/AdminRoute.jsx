import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
    const { user, loading } = useSelector(state => state.auth);

    if (loading) return <div>Loading...</div>;

    // Not logged in or not an admin
    if (!user || user.role !== 'admin') {
        return <Navigate to="/admin/login" replace state={{ message: "Please login as admin to access this page." }} />;
    }

    return children;
};

export default AdminRoute;
