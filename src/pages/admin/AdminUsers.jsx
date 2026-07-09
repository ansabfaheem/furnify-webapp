import React, { useState, useEffect } from 'react';
import { Shield, ShieldOff, Trash2, Search, UserX, UserCheck } from 'lucide-react';
import { api } from '../../services/api';
import { useSelector } from 'react-redux';
import './AdminUsers.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user: currentUser } = useSelector(state => state.auth); // To prevent self-blocking

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await api.getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (userId, newStatus) => {
        try {
            await api.updateUser(userId, { status: newStatus });
            fetchUsers();
        } catch (error) {
            console.error(`Failed to update user status to ${newStatus}`, error);
        }
    };

    const handleUpdateRole = async (userId, currentRole) => {
        try {
             // Only allow toggling if it's not the currently logged in admin
            const newRole = currentRole === 'admin' ? 'user' : 'admin';
            await api.updateUser(userId, { role: newRole });
            fetchUsers();
        } catch (error) {
            console.error('Failed to update user role', error);
        }
    };

    // Filtering logic (exclude password from search)
    const filteredUsers = users.filter(user => {
        const searchUpper = searchTerm.toUpperCase();
        return (
            user.name?.toUpperCase().includes(searchUpper) ||
            user.email?.toUpperCase().includes(searchUpper) ||
            user.role?.toUpperCase().includes(searchUpper)
        );
    });

    return (
        <div className="admin-users-container">
            <div className="admin-users-header">
                <h2>User Management</h2>
                <p className="subtitle">Manage user accounts, roles, and access.</p>
            </div>

            <div className="admin-controls">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search users by name or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="stats-box">
                    Total Users: <strong>{users.length}</strong>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading users...</div>
            ) : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(u => (
                                <tr key={u.id} className={u.status === 'inactive' || u.status === 'blocked' ? 'inactive-row' : ''}>
                                    <td>
                                        <div className="user-name">
                                            {u.name}
                                            {currentUser.id === u.id && <span className="badge badge-info ml-2">You</span>}
                                        </div>
                                    </td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`role-badge ${u.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                                            {u.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${
                                            !u.status || u.status === 'active' ? 'status-active' : 
                                            u.status === 'blocked' ? 'status-warning' : 'status-inactive'
                                        }`}>
                                            {!u.status ? 'Active' : u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            {/* Role Toggle */}
                                            {currentUser.id !== u.id && (
                                                <button 
                                                    className={`btn-icon ${u.role === 'admin' ? 'demote-btn' : 'promote-btn'}`}
                                                    onClick={() => handleUpdateRole(u.id, u.role)}
                                                    title={u.role === 'admin' ? "Remove Admin Admin" : "Make Admin"}
                                                >
                                                    {u.role === 'admin' ? <ShieldOff size={16} /> : <Shield size={16} />}
                                                </button>
                                            )}

                                            {/* Block Toggle */}
                                            {currentUser.id !== u.id && (
                                                <button 
                                                    className={`btn-icon ${u.status === 'blocked' ? 'unblock-btn' : 'block-btn'}`}
                                                    onClick={() => handleUpdateStatus(u.id, u.status === 'blocked' ? 'active' : 'blocked')}
                                                    title={u.status === 'blocked' ? "Unblock User" : "Block User"}
                                                >
                                                    {u.status === 'blocked' ? <UserCheck size={16} /> : <UserX size={16} />}
                                                </button>
                                            )}

                                            {/* Soft Delete */}
                                            {currentUser.id !== u.id && (
                                                <button 
                                                    className={`btn-icon ${u.status === 'inactive' ? 'restore-btn' : 'delete-btn'}`} 
                                                    onClick={() => handleUpdateStatus(u.id, u.status === 'inactive' ? 'active' : 'inactive')}
                                                    title={u.status === 'inactive' ? "Restore User" : "Deactivate User"}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center no-data">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
