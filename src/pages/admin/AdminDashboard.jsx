import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Package, Users as UsersIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../../redux/slices/authSlice';
import './AdminDashboard.css';

import AdminProducts from './AdminProducts';
import AdminUsers from './AdminUsers';

// Dashboard Home
const DashboardHome = () => (
    <div className="dashboard-home">
        <div className="dashboard-header-intro">
            <h2>Welcome to the Admin Portal</h2>
            <p>Select an option from the sidebar to manage your store.</p>
        </div>

        <div className="dashboard-stats">
            <div className="stat-card">
                <div className="stat-icon-wrapper">
                    <Package size={28} />
                </div>
                <h3>Manage Products</h3>
                <p>View, add, edit, or remove products securely.</p>
                <Link to="/admin/dashboard/products" className="btn btn-outline">Go to Products</Link>
            </div>

            <div className="stat-card">
                <div className="stat-icon-wrapper">
                    <UsersIcon size={28} />
                </div>
                <h3>Manage Users</h3>
                <p>View registered users, block accounts, or remove them.</p>
                <Link to="/admin/dashboard/users" className="btn btn-outline">Go to Users</Link>
            </div>
        </div>
    </div>
);


const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logoutAction());
        navigate('/admin/login', { replace: true });
    };


    return (
        <div className="admin-layout">

            {/* Main Content Area */}
            <main className="admin-main">
                <header className="admin-topbar">
                    <div className="topbar-brand">
                        <h2>Hello! Boss</h2>
                    </div>

                    <nav className="topbar-nav">
                        <Link to="/admin/dashboard" className={`nav-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </Link>
                        <Link to="/admin/dashboard/products" className={`nav-link ${location.pathname.includes('/products') ? 'active' : ''}`}>
                            <Package size={18} />
                            <span>Products</span>
                        </Link>
                        <Link to="/admin/dashboard/users" className={`nav-link ${location.pathname.includes('/users') ? 'active' : ''}`}>
                            <UsersIcon size={18} />
                            <span>Users</span>
                        </Link>
                    </nav>

                    <div className="topbar-actions">
                        <button onClick={handleLogout} className="logout-btn">
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </header>

                <div className="admin-content">
                    <Routes>
                        <Route path="/" element={<DashboardHome />} />
                        <Route path="/products" element={<AdminProducts />} />
                        <Route path="/users" element={<AdminUsers />} />
                        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
