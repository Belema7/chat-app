import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock User for testing - bypass login
        const mockUser = {
            id: 'user_123',
            name: 'Test Setup User',
            email: 'test@example.com',
            avatar: null
        };
        setUser(mockUser);
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await api.login(email, password);
        setUser(data.user);
        localStorage.setItem('chat_app_user', JSON.stringify(data.user));
        localStorage.setItem('chat_app_token', data.token);
        return data.user;
    };

    const register = async (name, email, password) => {
        const data = await api.register(name, email, password);
        setUser(data.user);
        localStorage.setItem('chat_app_user', JSON.stringify(data.user));
        localStorage.setItem('chat_app_token', data.token);
        return data.user;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('chat_app_user');
        localStorage.removeItem('chat_app_token');
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
