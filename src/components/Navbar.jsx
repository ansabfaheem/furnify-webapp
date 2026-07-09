import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User, LogOut, Heart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../redux/slices/authSlice';
import { selectCartCount } from '../redux/slices/cartSlice';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const cartCount = useSelector(selectCartCount);
  const wishlist = useSelector(state => state.wishlist.items);

  const logout = () => dispatch(logoutAction());
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    setIsOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        
        {/* Left Side: Mobile Menu Toggle + Logo */}
        <div className="navbar-brand-group">
          <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            <Menu size={24} />
          </button>
          <Link to="/" className="navbar-logo">
            <span className="navbar-logo-text">Furnify</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="desktop-menu">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              {link.name}
            </NavLink>
          ))}
          {user && user.role === 'admin' && (
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Admin Portal</NavLink>
          )}
        </div>

        {/* Right Side Actions: fixed Search, Wishlist, Cart */}
        <div className="navbar-actions">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn"><Search size={18} color="var(--color-text)" /></button>
          </form>

          {user && (
            <Link to="/wishlist" className="cart-link" title="Wishlist">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="cart-badge">{wishlist.length}</span>
              )}
            </Link>
          )}

          <Link to="/cart" className="cart-link" title="Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>

          {/* User Section (Hidden on Mobile) */}
          <div className="desktop-user-actions">
            {user ? (
              <div className="user-section">
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} title="Logout" className="logout-btn">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-link">
                <User size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      <div 
        className={`mobile-drawer-overlay ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Mobile Sidebar Drawer */}
      <div className={`mobile-drawer ${isOpen ? 'active' : ''}`}>
        <div className="drawer-header">
          <span className="navbar-logo-text">Furnify</span>
          <button className="close-drawer" onClick={() => setIsOpen(false)} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>
        
        <div className="drawer-links">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="mobile-nav-link"
            >
              {link.name}
            </Link>
          ))}
          {user && user.role === 'admin' && (
            <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="mobile-nav-link">
              Admin Portal
            </Link>
          )}
        </div>
        
        <div className="drawer-footer">
          {user ? (
            <div className="drawer-user-info">
              <span className="drawer-user-name">Hello, <b>{user.name}</b></span>
              <button onClick={handleLogout} className="drawer-logout-btn">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="drawer-login-btn">
              <User size={18} />
              <span>Login / Register</span>
            </Link>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Confirm Logout</h3>
            <p className="modal-text">Are you confirm want to log out ?</p>
            <div className="modal-actions">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="btn btn-cancel"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="btn btn-primary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
