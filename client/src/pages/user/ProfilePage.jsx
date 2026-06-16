import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, CreditCard, ShoppingBag, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const ProfilePage = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Error logging out', error);
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="loading loading-spinner loading-lg text-[#2d3695]"></span>
      </div>
    );
  }

  const initials = user?.fullName
    ? user.fullName.split(" ").map(n => n[0]).join("").toUpperCase()
    : "ST";

  return (
    <>
      <div className="bg-[#F5F5F5] min-h-screen pb-10 font-sans text-slate-800">
                  
      <div className="container mx-auto px-4 md:px-8 pt-8 max-w-3xl">
        
        {/* Profile Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-2xl shadow-inner">
            {initials}
          </div>
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h1 className="text-xl font-black text-slate-800">{user?.fullName || "ข้อมูลนักศึกษา"}</h1>
            <p className="text-sm text-slate-500 font-medium flex items-center justify-center sm:justify-start">
              <User className="w-4 h-4 mr-1.5 text-slate-400" />
              รหัสนักศึกษา: {user?.studentId}
            </p>
            <p className="text-sm text-slate-500 font-medium flex items-center justify-center sm:justify-start">
              <Mail className="w-4 h-4 mr-1.5 text-slate-400" />
              อีเมล: {user?.email}
            </p>
          </div>
        </div>

        {/* Quick Actions / Navigation items */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-2 mb-3">
            รายการของฉัน
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/user/BuyHistoryPage')}
              className="flex items-center space-x-3 p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-xl transition-all text-left"
            >
              <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-800 block">ประวัติการซื้อ</span>
                <span className="text-[10px] text-slate-400">ตรวจสอบหนังสือที่เคยซื้อ</span>
              </div>
            </button>

            <button 
              onClick={() => navigate('/user/SellHistoryPage')}
              className="flex items-center space-x-3 p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-xl transition-all text-left"
            >
              <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-800 block">ประวัติการขาย</span>
                <span className="text-[10px] text-slate-400">จัดการโพสต์และหนังสือที่ลงขาย</span>
              </div>
            </button>
          </div>
        </div>

        {/* Logout button */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all rounded-xl font-bold text-sm border border-red-500/20 active:scale-98"
        >
          <LogOut className="w-4 h-4" />
          <span>ออกจากระบบ</span>
        </button>

      </div>
    </div>

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
};

export default ProfilePage;
