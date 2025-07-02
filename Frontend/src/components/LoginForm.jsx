import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginForm.css';

const LoginForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
    const { login, register } = useAuth();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (isLogin) {
            if (!formData.email) newErrors.email = 'Email is required';
            if (!formData.password) newErrors.password = 'Password is required';
            if (!formData.role) newErrors.role = 'Please select a role';
            
            if (formData.email && !formData.email.includes('@')) {
                newErrors.email = 'Please enter a valid email address';
            }
        } else {
            if (!formData.name) newErrors.name = 'Name is required';
            if (!formData.email) newErrors.email = 'Email is required';
            if (!formData.password) newErrors.password = 'Password is required';
            if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
            if (!formData.role) newErrors.role = 'Please select a role';

            if (formData.email && !formData.email.includes('@')) {
                newErrors.email = 'Please enter a valid email address';
            }

            if (formData.password && formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }

            if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        try {
            let result;
            
            if (isLogin) {
                result = await login(formData.email, formData.password, formData.role);
                if (result.success) {
                    navigate('/');
                } else {
                    let msg = result.error || 'Login failed.';
                    if (msg.toLowerCase().includes('invalid email') || msg.toLowerCase().includes('not found')) {
                        msg = 'No account found with this email. Please register first.';
                    }
                    setErrors({ general: msg });
                }
            } else {
                result = await register(formData.name, formData.email, formData.password, formData.role);
                if (result.success) {
                    setSuccessMessage('Registration successful! You can now login.');
                    setTimeout(() => {
                        setIsLogin(true);
                        setSuccessMessage('');
                        setFormData({
                            name: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                            role: ''
                        });
                    }, 2000);
                } else {
                    setErrors({ general: result.error || 'Registration failed.' });
                }
            }
        } catch (error) {
            setErrors({ general: 'An unexpected error occurred' });
        } finally {
            setLoading(false);
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setErrors({});
        setSuccessMessage('');
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: ''
        });
    };

  return (
    <div className="auth-container">
            <div className="auth-wrapper">
                {/* Login Form */}
                <div className={`auth-card ${!isLogin ? 'hidden' : ''}`}>
                    <div className="auth-header">
                        <i className="fas fa-user-shield auth-icon"></i>
                        <h1>Employee Portal</h1>
                        <p>Sign in to access your dashboard</p>
                    </div>
                    
                    {errors.general && (
                        <div className="error-message">
                            {errors.general}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="login-email">Email Address</label>
                            <div className="input-wrapper">
                                <i className="fas fa-envelope input-icon"></i>
                                <input
                                    type="email"
                                    id="login-email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={errors.email ? 'error' : ''}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                            {errors.email && <span className="field-error">{errors.email}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="login-password">Password</label>
                            <div className="input-wrapper">
                                <i className="fas fa-lock input-icon"></i>
                                <input
                                    type="password"
                                    id="login-password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={errors.password ? 'error' : ''}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            {errors.password && <span className="field-error">{errors.password}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="login-role">Role</label>
                            <select
                                id="login-role"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className={errors.role ? 'error' : ''}
                                required
                            >
                                <option value="" disabled>Select your role</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                            {errors.role && <span className="field-error">{errors.role}</span>}
                        </div>
                        
                        <div className="form-options">
                            <div className="checkbox-group">
                                <input type="checkbox" id="remember-me" />
                                <label htmlFor="remember-me">Remember me</label>
                            </div>
                            <a href="#" className="forgot-link">Forgot password?</a>
                        </div>
                        
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>
                    
                    <div className="auth-footer">
                        <p>Don't have an account? 
                            <button type="button" onClick={toggleForm} className="toggle-link">
                                Register here
                            </button>
                        </p>
                    </div>
                </div>
                
                {/* Registration Form */}
                <div className={`auth-card ${isLogin ? 'hidden' : ''}`}>
                    <div className="auth-header">
                        <i className="fas fa-user-plus auth-icon"></i>
                        <h1>Create Account</h1>
                        <p>Join our employee management system</p>
                    </div>
                    
                    {errors.general && (
                        <div className="error-message">
                            {errors.general}
                        </div>
                    )}
                    
                    {successMessage && (
                        <div className="success-message">
                            {successMessage}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="register-name">Full Name</label>
                            <div className="input-wrapper">
                                <i className="fas fa-user input-icon"></i>
                                <input
                                    type="text"
                                    id="register-name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={errors.name ? 'error' : ''}
                                    placeholder="Name"
                                    required
                                />
                            </div>
                            {errors.name && <span className="field-error">{errors.name}</span>}
                        </div>
                        
        <div className="form-group">
                            <label htmlFor="register-email">Email Address</label>
                            <div className="input-wrapper">
                                <i className="fas fa-envelope input-icon"></i>
          <input
            type="email"
                                    id="register-email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={errors.email ? 'error' : ''}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                            {errors.email && <span className="field-error">{errors.email}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="register-password">Password</label>
                            <div className="input-wrapper">
                                <i className="fas fa-lock input-icon"></i>
                                <input
                                    type="password"
                                    id="register-password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={errors.password ? 'error' : ''}
                                    placeholder="••••••••"
                                    minLength="6"
            required
          />
        </div>
                            <p className="password-hint">Must be at least 6 characters</p>
                            {errors.password && <span className="field-error">{errors.password}</span>}
                        </div>
                        
        <div className="form-group">
                            <label htmlFor="register-confirm-password">Confirm Password</label>
                            <div className="input-wrapper">
                                <i className="fas fa-lock input-icon"></i>
          <input
            type="password"
                                    id="register-confirm-password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={errors.confirmPassword ? 'error' : ''}
                                    placeholder="••••••••"
            required
          />
        </div>
                            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="register-role">Role</label>
                            <select
                                id="register-role"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className={errors.role ? 'error' : ''}
                                required
                            >
                                <option value="" disabled>Select your role</option>
                                <option value="admin">Admin</option>
                                <option value="user">Regular User</option>
                            </select>
                            {errors.role && <span className="field-error">{errors.role}</span>}
                        </div>
                        
                        <div className="form-group">
                            <div className="checkbox-group">
                                <input type="checkbox" id="terms" required />
                                <label htmlFor="terms">
                                    I agree to the <a href="#" className="terms-link">Terms and Conditions</a>
                                </label>
                            </div>
                        </div>
                        
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
      </form>
                    
                    <div className="auth-footer">
                        <p>Already have an account? 
                            <button type="button" onClick={toggleForm} className="toggle-link">
                                Login here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
    </div>
  );
};

export default LoginForm;
