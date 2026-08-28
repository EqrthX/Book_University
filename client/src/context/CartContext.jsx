import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../util/axios.js';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        if (!user) {
            setCartItems([]);
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get('/cart/show-cart', { withCredentials: true });
            setCartItems(res.data.books || []);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto fetch cart when user logs in or changes
    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (bookId) => {
        try {
            const res = await axios.post(`/cart/add-to-cart/${bookId}`, {}, { withCredentials: true });
            if (res.status === 201) {
                toast.success(res.data.message || "เพิ่มเข้าตะกร้าเรียบร้อย");
                await fetchCart(); // Refresh cart count
                return true;
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data?.error;
            toast.error(errorMsg || "ไม่สามารถเพิ่มหนังสือเข้าตะกร้าได้");
        }
        return false;
    };

    const deleteItem = async (cartId) => {
        try {
            await axios.delete(`/cart/${cartId}`, { withCredentials: true });
            setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
            toast.success("ลบสินค้าเรียบร้อย");
            return true;
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("ลบสินค้าไม่สำเร็จ");
        }
        return false;
    };

    const deleteSelected = async (selectedIds) => {
        try {
            await axios.delete('/cart/delete-item-cart', {
                data: { cartIds: selectedIds },
                withCredentials: true
            });
            setCartItems((prev) => prev.filter((item) => !selectedIds.includes(item.cartId)));
            toast.success("ลบรายการที่เลือกเรียบร้อย");
            return true;
        } catch (error) {
            console.error("Error deleting selected items:", error);
            toast.error("ลบรายการล้มเหลว");
        }
        return false;
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.length;

    return (
        <CartContext.Provider value={{
            cartItems,
            loading,
            cartCount,
            fetchCart,
            addToCart,
            deleteItem,
            deleteSelected,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
