import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token in sessionStorage
        const token = sessionStorage.getItem('token');
        const role = sessionStorage.getItem('role');
        const name = sessionStorage.getItem('name');

        if (token && role) {
            setUser({ token, role, name });
        }
        setLoading(false);

        // Axios Interceptor to handle 401 globally
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    // Token expired or invalid (e.g., db reset)
                    logout();
                    window.location.href = '/login'; // Force redirect
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    const login = async (role, identifier, password) => {
        try {
            setLoading(true);
            const body = {};
            if (role === 'police') {
                body.badgeId = identifier;
            } else {
                body.email = identifier;
            }
            body.password = password;

            const response = await axios.post('http://localhost:5000/api/auth/login', body);

            const data = response.data;

            // Validate role matches (optional safety check)
            if (data.role !== role && role !== 'admin') {
                // In a real app we might handle this better, but for now allow if valid
                // Or throw error: throw new Error('Role mismatch');
            }

            const userData = {
                token: data.token,
                role: data.role,
                name: data.name,
                email: data.email,
                id: data._id
            };

            sessionStorage.setItem('token', userData.token);
            sessionStorage.setItem('role', userData.role);
            sessionStorage.setItem('name', userData.name);
            sessionStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            return userData;
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
