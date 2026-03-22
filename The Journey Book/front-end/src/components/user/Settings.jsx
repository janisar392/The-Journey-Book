import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Settings.css';

const Settings = () => {
    const { user, updateUser } = useAuth(); // Add updateUser if available
    const [activeTab, setActiveTab] = useState('account');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const BASE_URL = 'https://the-journey-book-backend.onrender.com';

    const [accountInfo, setAccountInfo] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const [securityInfo, setSecurityInfo] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Fetch profile on component mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please login again');
            return;
        }

        try {
            console.log('Fetching profile...');
            const response = await fetch(`${BASE_URL}/api/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Profile data received:', data);
                
                // Update form with fetched data
                setAccountInfo({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || ''
                });
            } else {
                console.error('Failed to fetch profile, status:', response.status);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile');
        }
    };

    const handleAccountUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please login again');
            setLoading(false);
            return;
        }

        // Clean phone number
        let cleanPhone = accountInfo.phone;
        if (cleanPhone) {
            cleanPhone = cleanPhone.replace(/\D/g, '');
            if (cleanPhone.length > 10) {
                cleanPhone = cleanPhone.slice(-10);
            }
        }

        console.log('Sending update with:', {
            name: accountInfo.name,
            email: accountInfo.email,
            phone: cleanPhone
        });

        try {
            const response = await fetch(`${BASE_URL}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: accountInfo.name,
                    email: accountInfo.email,
                    phone: cleanPhone
                })
            });

            const data = await response.json();
            console.log('Update response:', data);

            if (response.ok) {
                setSuccess(data.message || 'Profile updated successfully!');
                
                // Update user in localStorage
                const currentUser = JSON.parse(localStorage.getItem('user'));
                const updatedUser = { ...currentUser, ...data.user };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                // Refresh profile data
                await fetchUserProfile();
                
                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.error || data.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Update error:', err);
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (securityInfo.newPassword !== securityInfo.confirmPassword) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }

        if (securityInfo.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please login again');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/users/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: securityInfo.currentPassword,
                    newPassword: securityInfo.newPassword,
                    confirmPassword: securityInfo.confirmPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message || 'Password changed successfully!');
                setSecurityInfo({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.error || data.message || 'Failed to change password');
            }
        } catch (err) {
            console.error('Password change error:', err);
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'account', label: 'Account', icon: 'fas fa-user' },
        { id: 'security', label: 'Security', icon: 'fas fa-shield-alt' },
        { id: 'preferences', label: 'Preferences', icon: 'fas fa-cog' },
        { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
        { id: 'privacy', label: 'Privacy', icon: 'fas fa-lock' }
    ];

    return (
        <div className="settings-container">
            <div className="container py-5">
                <div className="row">
                    {/* Settings Sidebar */}
                    <div className="col-lg-3">
                        <div className="settings-sidebar card">
                            <div className="card-body">
                                <h4 className="mb-4">Settings</h4>
                                <nav className="settings-menu">
                                    {tabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            className={`settings-menu-item ${activeTab === tab.id ? 'active' : ''}`}
                                            onClick={() => setActiveTab(tab.id)}
                                        >
                                            <i className={`${tab.icon} me-2`}></i>
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Settings Content */}
                    <div className="col-lg-9">
                        <div className="settings-content">
                            {success && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    <i className="fas fa-check-circle me-2"></i>
                                    {success}
                                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i className="fas fa-exclamation-circle me-2"></i>
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                                </div>
                            )}

                            {/* Account Settings */}
                            {activeTab === 'account' && (
                                <div className="settings-section card">
                                    <div className="card-header">
                                        <h4 className="mb-0">Account Information</h4>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleAccountUpdate}>
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">Full Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={accountInfo.name}
                                                        onChange={(e) => setAccountInfo({...accountInfo, name: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Email Address</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        value={accountInfo.email}
                                                        onChange={(e) => setAccountInfo({...accountInfo, email: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        value={accountInfo.phone}
                                                        onChange={(e) => setAccountInfo({...accountInfo, phone: e.target.value})}
                                                        placeholder="Enter 10-digit mobile number"
                                                    />
                                                    <small className="text-muted">
                                                        Enter 10-digit mobile number (e.g., 9608456380)
                                                    </small>
                                                </div>
                                            </div>
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <i className="fas fa-spinner fa-spin me-2"></i>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    'Save Changes'
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Security Settings */}
                            {activeTab === 'security' && (
                                <div className="settings-section card">
                                    <div className="card-header">
                                        <h4 className="mb-0">Security Settings</h4>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handlePasswordChange}>
                                            <div className="mb-3">
                                                <label className="form-label">Current Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    value={securityInfo.currentPassword}
                                                    onChange={(e) => setSecurityInfo({...securityInfo, currentPassword: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">New Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    value={securityInfo.newPassword}
                                                    onChange={(e) => setSecurityInfo({...securityInfo, newPassword: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    value={securityInfo.confirmPassword}
                                                    onChange={(e) => setSecurityInfo({...securityInfo, confirmPassword: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <i className="fas fa-spinner fa-spin me-2"></i>
                                                        Updating...
                                                    </>
                                                ) : (
                                                    'Change Password'
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Preferences Settings */}
                            {activeTab === 'preferences' && (
                                <div className="settings-section card">
                                    <div className="card-header">
                                        <h4 className="mb-0">Preferences</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row mb-4">
                                            <div className="col-md-6">
                                                <label className="form-label">Preferred Currency</label>
                                                <select className="form-select">
                                                    <option value="INR">Indian Rupee (₹)</option>
                                                    <option value="USD">US Dollar ($)</option>
                                                    <option value="EUR">Euro (€)</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Language</label>
                                                <select className="form-select">
                                                    <option value="English">English</option>
                                                    <option value="Hindi">Hindi</option>
                                                    <option value="Spanish">Spanish</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button className="btn btn-primary">Save Preferences</button>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Settings */}
                            {activeTab === 'notifications' && (
                                <div className="settings-section card">
                                    <div className="card-header">
                                        <h4 className="mb-0">Notification Settings</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-check mb-3">
                                            <input className="form-check-input" type="checkbox" id="bookingConfirm" defaultChecked />
                                            <label className="form-check-label" htmlFor="bookingConfirm">
                                                Booking confirmations
                                            </label>
                                        </div>
                                        <div className="form-check mb-3">
                                            <input className="form-check-input" type="checkbox" id="tripReminders" defaultChecked />
                                            <label className="form-check-label" htmlFor="tripReminders">
                                                Trip reminders
                                            </label>
                                        </div>
                                        <div className="form-check mb-3">
                                            <input className="form-check-input" type="checkbox" id="specialOffers" defaultChecked />
                                            <label className="form-check-label" htmlFor="specialOffers">
                                                Special offers and promotions
                                            </label>
                                        </div>
                                        <button className="btn btn-primary">Save Notification Settings</button>
                                    </div>
                                </div>
                            )}

                            {/* Privacy Settings */}
                            {activeTab === 'privacy' && (
                                <div className="settings-section card">
                                    <div className="card-header">
                                        <h4 className="mb-0">Privacy Settings</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-4">
                                            <h5>Data Privacy</h5>
                                            <p className="text-muted">
                                                Control how your data is used and shared.
                                            </p>
                                        </div>
                                        <div className="form-check mb-3">
                                            <input className="form-check-input" type="checkbox" id="dataAnalytics" defaultChecked />
                                            <label className="form-check-label" htmlFor="dataAnalytics">
                                                Allow data analytics to improve services
                                            </label>
                                        </div>
                                        <div className="d-flex gap-3">
                                            <button className="btn btn-outline-primary">
                                                <i className="fas fa-download me-2"></i>
                                                Download My Data
                                            </button>
                                            <button className="btn btn-danger">
                                                <i className="fas fa-trash me-2"></i>
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;