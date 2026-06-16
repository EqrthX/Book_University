import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, UserRound, LogOut, ShoppingBag, BookOpen } from "lucide-react";
import UTCC from "/src/assets/UTCC.png";
import { useAuth } from '../../context/AuthContext.jsx';
import axios from '../../util/axios.js';

function Head() {
  const { user, logout } = useAuth();
  const studentId = user?.studentId;
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const fetchCartCount = async () => {
    if (!user) {
      setCartCount(0);
      return;
    }
    try {
      const res = await axios.get('/cart/show-cart', { withCredentials: true });
      setCartCount(res.data.books?.length || 0);
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  };

  useEffect(() => {
    fetchCartCount();

    // Listen to custom event for real-time updates
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, [user]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  return (
    <>
      <nav className="relative z-20 w-full bg-white/85 backdrop-blur-md h-20 flex items-center px-6 md:px-12 border-b border-slate-200/50 m-0">
      
      {/* Logo */}
      <Link to="/user/HomePage" className="flex items-center">
        <img 
          src={UTCC} 
          className="h-14 w-auto object-contain cursor-pointer transition-transform duration-300 hover:scale-105" 
          alt="UTCC Logo"
        />
      </Link>

      <div className="ml-auto flex items-center space-x-5">

        {/* ตะกร้า */}
        <Link to="/user/BasketPage" className="relative group">
          <button className="text-slate-700 p-2.5 rounded-xl bg-slate-50 hover:bg-[#2F5792]/10 hover:text-[#2F5792] transition-all duration-300 shadow-sm hover:shadow-md border border-slate-100 flex items-center justify-center">
            <ShoppingCart className="w-5.5 h-5.5 transition-transform group-hover:scale-110" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#D93619] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce-subtle">
                {cartCount}
              </span>
            )}
          </button>
        </Link>

        {/* ข้อมูลโปรไฟล์ & dropdown */}
        <div className="flex items-center space-x-3">
          <span className="hidden md:inline-block text-slate-600 font-semibold text-xs bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200/60 tracking-wider">
            {studentId || "Student"}
          </span>

          <div className="dropdown dropdown-end">
            <div 
              tabIndex={0} 
              role="button" 
              className="btn btn-ghost btn-circle avatar border border-slate-200 hover:border-[#2F5792]/40 hover:bg-[#2F5792]/5 transition-all shadow-sm"
            >
              <div className="w-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-700">
                <UserRound className="w-5 h-5 mx-auto mt-2" />
              </div>
            </div>
            <ul 
              tabIndex={0} 
              className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow-2xl bg-white border border-slate-100 rounded-2xl w-60 text-slate-700 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="px-4 py-3 border-b border-slate-100 mb-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">บัญชีผู้ใช้</p>
                <p className="font-bold text-slate-800 truncate text-sm mt-0.5">{studentId || "รหัสนักศึกษา"}</p>
              </div>
              
              <li>
                <Link to="/user/ProfilePage" className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold">
                  <UserRound className="w-4.5 h-4.5 text-slate-400" />
                  <span>โปรไฟล์ของฉัน</span>
                </Link>
              </li>
              <li>
                <Link to="/user/BuyHistoryPage" className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold">
                  <ShoppingBag className="w-4.5 h-4.5 text-slate-400" />
                  <span>ประวัติการซื้อ</span>
                </Link>
              </li>
              <li>
                <Link to="/user/SellHistoryPage" className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold">
                  <BookOpen className="w-4.5 h-4.5 text-slate-400" />
                  <span>ประวัติการขาย</span>
                </Link>
              </li>
              
              <div className="divider my-1 before:bg-slate-100 after:bg-slate-100"></div>
              
              <li>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold w-full text-left"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  <span>ออกจากระบบ</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </nav>

    {showLogoutConfirm && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200 text-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-850">ออกจากระบบ</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">ยืนยันต้องการออกจากระบบหรือไม่?</p>
            </div>
          </div>
          <p className="text-slate-500 font-semibold text-xs leading-relaxed mb-6">
            เซสชันของคุณจะถูกทำลายและต้องเข้าสู่ระบบอีกครั้งเพื่อใช้งานบัญชีนี้ต่อ
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs transition-all duration-200 cursor-pointer text-center text-slate-600"
            >
              ยกเลิก
            </button>
            <button
              onClick={confirmLogout}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-md shadow-red-500/10 hover:shadow-red-500/20 hover:scale-[1.01] transition-all duration-200 cursor-pointer text-center"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
}

export default Head;
