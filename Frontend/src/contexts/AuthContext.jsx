import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(authService.getUser());
    const [token, setToken] = useState(authService.getToken());
    const [loading, setLoading] = useState(true);

    // Check if user is authenticated on app load
    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const result = await authService.getProfile();
                    if (result.success) {
                        setUser(result.data.user);
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, [token]);

    const login = async (email, password, role) => {
        const result = await authService.login(email, password, role);
        if (result.success) {
            setUser(result.data.user);
            setToken(result.data.token);
        }
        return result;
    };

    const register = async (name, email, password, role) => {
        const result = await authService.register(name, email, password, role);
        if (result.success) {
            setUser(result.data.user);
            setToken(result.data.token);
        }
        return result;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        authService.logout();
    };

    const isAuthenticated = () => {
        return !!user && !!token;
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
