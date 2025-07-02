import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '1.2rem',
                color: '#6366f1'
            }}>
                Loading...
            </div>
        );
    }

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin()) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute; 