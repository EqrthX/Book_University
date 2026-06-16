import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../util/axios.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await axios.get('/auth/check-auth', { withCredentials: true });
            setUser(res.data.user);
        } catch (error) {
            console.error("Auth check failed:", error.message);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const loginUser = async (studentId, password) => {
        setLoading(true);
        try {
            const res = await axios.post('/auth/login', { studentId, password }, { withCredentials: true });
            setUser(res.data.user);
            return res.data.user;
        } catch (error) {
            setUser(null);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = async () => {
        setLoading(true);
        try {
            await axios.post('/auth/logout', {}, { withCredentials: true });
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login: loginUser, logout: logoutUser, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
