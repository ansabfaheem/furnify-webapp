import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice';
import './AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setNotification(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // Redirect to dashboard if already logged in as admin
    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const loggedInUser = await dispatch(loginUser({email, password})).unwrap();
            if (loggedInUser.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                setError('Access Denied. You are not an admin.');
            }
        } catch (err) {
            setError(err || 'Invalid credentials');
        }
    };

    return (
        <div className="admin-login-page">
            {notification && (
                <div className="notification-popup">
                    {notification}
                    <button onClick={() => setNotification('')} className="close-notification-btn">X</button>
                </div>
            )}

            <div className="admin-login-container">
                <div className="admin-header text-center">
                    <h2 className="admin-login-title">Admin Portal</h2>
                    <p className="admin-subtitle">Login to manage the store</p>
                </div>

                {error && (
                    <div className="error-alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Admin Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            placeholder="e.g. admin@furnify.com"
                        />
                    </div>
                    <div className="form-group-last">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary login-btn">Secure Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
