const API_BASE_URL = 'http://localhost:8000/api';

class AuthService {
    async login(email, password, role) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, role })
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true, data };
            } else {
                return { success: false, error: data.error || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error. Please check your connection.' };
        }
    }

    async register(name, email, password, role) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data };
            } else {
                if (data.errors && data.errors.length > 0) {
                    return { success: false, error: data.errors[0].msg };
                } else {
                    return { success: false, error: data.error || 'Registration failed' };
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: 'Network error. Please check your connection.' };
        }
    }

    async getProfile() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return { success: false, error: 'No token found' };
            }

            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, error: data.error || 'Failed to get profile' };
            }
        } catch (error) {
            console.error('Get profile error:', error);
            return { success: false, error: 'Network error' };
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return { success: true };
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    isAuthenticated() {
        return !!this.getToken();
    }
}

export default new AuthService(); 