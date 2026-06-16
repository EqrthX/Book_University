import axios from '../../util/axios.js'
import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { UserRoundPlus, Wallet, BookPlus, LogOut, Shield } from 'lucide-react';
import HeadAdmin from '../../components/admin/HeadAdmin.jsx'

const AdminHomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/auth/check-auth', { withCredentials: true });
        setUserName(res.data.user.studentId);
      } catch (error) {
        console.error("User not authenticated", error);
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Logout failed: ", error);
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const navItems = [
    { to: 'register', label: 'ลงทะเบียนนักศึกษา', icon: UserRoundPlus },
    { to: 'check-books', label: 'ตรวจสอบหนังสือ', icon: BookPlus },
    { to: 'check-payment', label: 'ตรวจสอบชำระเงิน', icon: Wallet },
  ];

  return (
    <>
      <div className='w-full min-h-screen flex bg-slate-50 font-sans text-slate-800'>
      {/* Sidebar */}
      <aside className='w-[20%] bg-[#0B1E3B] flex flex-col justify-between text-left h-screen fixed top-0 left-0 border-r border-white/5 shadow-2xl z-30'>
        <div>
          {/* Logo Brand area */}
          <div className="p-6 border-b border-white/5 flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="font-extrabold text-white leading-none tracking-wide text-md">Book University</h1>
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">Admin Panel</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.includes(`/admin/AdminHomePage/${item.to}`);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        
        {/* Footer Admin Info */}
        <div className='p-6 border-t border-white/5 flex flex-col gap-4 bg-[#07152B]'>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
              AD
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs text-slate-500 font-semibold uppercase">รหัสผู้ดูแล</h4>
              <p className="text-sm font-bold text-white truncate">{userName || "Admin"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout} 
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all rounded-xl font-semibold text-sm border border-red-500/20 active:scale-98"
          >
            <LogOut className="w-4 h-4" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className='w-[80%] ml-[20%] flex flex-col min-h-screen'>
        <HeadAdmin />
        <main className='flex-1 p-8 overflow-y-auto relative z-10'>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[calc(100vh-160px)]">
            <Outlet />
          </div>
        </main>
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
                <h3 className="font-extrabold text-lg text-slate-850">ออกจากระบบ (Admin)</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">ยืนยันต้องการออกจากระบบหรือไม่?</p>
              </div>
            </div>
            <p className="text-slate-500 font-semibold text-xs leading-relaxed mb-6">
              เซสชันผู้ดูแลระบบของคุณจะถูกทำลายและต้องเข้าสู่ระบบอีกครั้งเพื่อเข้าสู่แผงควบคุม
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

export default AdminHomePage;
