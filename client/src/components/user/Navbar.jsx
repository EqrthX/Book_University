import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, ChevronDown, Bell } from "lucide-react";
import axios from '../../util/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';
import SearchInput from "./SearchInput.jsx";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleHistory = () => setHistoryOpen(!historyOpen);
  


  const fetchUnreadCount = async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await axios.get('/notifications/getNotifications', { withCredentials: true });
      const unread = res.data.notifications?.filter(n => n.status === 'unread') || [];
      setUnreadCount(unread.length);
    } catch (err) {
      console.error("Error fetching unread notifications:", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const handleNotificationsUpdate = () => {
      fetchUnreadCount();
    };

    window.addEventListener('notifications-updated', handleNotificationsUpdate);
    return () => {
      window.removeEventListener('notifications-updated', handleNotificationsUpdate);
    };
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setHistoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path) => location.pathname === path;
  const isHistoryActive = () => 
    location.pathname === "/user/BuyHistoryPage" || 
    location.pathname === "/user/SellHistoryPage" || 
    location.pathname === "/user/OrderPage";

  return (
    <nav className="relative z-10 w-full bg-gradient-to-r from-[#1A365D] via-[#2F5792] to-[#2B6CB0] h-20 flex items-center px-6 md:px-10 border-t border-white/5 m-0">
      
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMenu} 
        className="md:hidden text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-200"
      >
        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Search Bar Component */}
      <SearchInput />

      {/* Main Menu (Desktop) */}
      <div className="hidden md:flex ml-auto pr-20 items-center">
        <ul className="flex items-center space-x-4 relative">
          <li>
            <Link 
              to="/user/Chat" 
              className={`font-semibold py-2.5 px-4.5 rounded-xl transition-all duration-200 flex items-center ${
                isActive("/user/Chat") 
                  ? "text-white bg-white/15 shadow-sm border-b-2 border-[#F8E94C]" 
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              แชทพูดคุย
            </Link>
          </li>
          
          <li>
            <Link 
              to="/user/AddBook" 
              className={`font-semibold py-2.5 px-4.5 rounded-xl transition-all duration-200 flex items-center ${
                isActive("/user/AddBook") 
                  ? "text-white bg-white/15 shadow-sm border-b-2 border-[#F8E94C]" 
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              ต้องการขาย
            </Link>
          </li>

          {/* Dropdown ประวัติ */}
          <li className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleHistory} 
              className={`font-semibold py-2.5 px-4.5 rounded-xl transition-all duration-200 flex items-center gap-1 ${
                isHistoryActive() 
                  ? "text-white bg-white/15 shadow-sm border-b-2 border-[#F8E94C]" 
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>เพิ่มเติม</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${historyOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {historyOpen && (
              <ul className="absolute left-0 top-full mt-3 bg-white text-slate-800 shadow-2xl rounded-2xl w-48 p-2 border border-slate-100 z-[101] animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col gap-1">
                <li>
                  <Link 
                    to="/user/BuyHistoryPage" 
                    onClick={() => setHistoryOpen(false)}
                    className="block px-4 py-2.5 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors text-slate-700 hover:text-slate-900"
                  >
                    ประวัติการซื้อ
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/user/SellHistoryPage" 
                    onClick={() => setHistoryOpen(false)}
                    className="block px-4 py-2.5 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors text-slate-700 hover:text-slate-900"
                  >
                    ประวัติการขาย
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/user/OrderPage" 
                    onClick={() => setHistoryOpen(false)}
                    className="block px-4 py-2.5 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors text-slate-700 hover:text-slate-900"
                  >
                    รายการคำสั่งซื้อ
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link 
              to="/user/NotificationPage" 
              className={`relative font-bold p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
                isActive("/user/NotificationPage")
                  ? "text-white bg-white/15 shadow-sm"
                  : "text-white/85 hover:text-white hover:bg-white/10"
              }`}
            >
              <Bell className="w-5.5 h-5.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D93619] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-[#2F5792] animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#1A365D]/95 backdrop-blur-lg border-b border-white/10 p-5 md:hidden shadow-2xl flex flex-col space-y-2.5 rounded-b-2xl z-40 transition-all duration-300 ease-out">
          <ul className="flex flex-col gap-1.5 w-full text-left">
            <li>
              <Link 
                to="/user/Chat" 
                onClick={toggleMenu}
                className={`py-3 px-4.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                  isActive("/user/Chat")
                    ? "text-white bg-white/15 border-l-4 border-[#F8E94C] pl-3.5"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <span>แชทพูดคุย</span>
              </Link>
            </li>
            
            <li>
              <Link 
                to="/user/AddBook" 
                onClick={toggleMenu}
                className={`py-3 px-4.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                  isActive("/user/AddBook")
                    ? "text-white bg-white/15 border-l-4 border-[#F8E94C] pl-3.5"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <span>ต้องการขาย</span>
              </Link>
            </li>

            <div className="divider my-1 before:bg-white/10 after:bg-white/10"></div>

            <li>
              <Link 
                to="/user/BuyHistoryPage" 
                onClick={toggleMenu}
                className={`py-3 px-4.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                  isActive("/user/BuyHistoryPage")
                    ? "text-white bg-white/15 border-l-4 border-[#F8E94C] pl-3.5"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <span>ประวัติการซื้อ</span>
              </Link>
            </li>
            
            <li>
              <Link 
                to="/user/SellHistoryPage" 
                onClick={toggleMenu}
                className={`py-3 px-4.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                  isActive("/user/SellHistoryPage")
                    ? "text-white bg-white/15 border-l-4 border-[#F8E94C] pl-3.5"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <span>ประวัติการขาย</span>
              </Link>
            </li>

            <li>
              <Link 
                to="/user/OrderPage" 
                onClick={toggleMenu}
                className={`py-3 px-4.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                  isActive("/user/OrderPage")
                    ? "text-white bg-white/15 border-l-4 border-[#F8E94C] pl-3.5"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <span>รายการคำสั่งซื้อ</span>
              </Link>
            </li>

            <div className="divider my-1 before:bg-white/10 after:bg-white/10"></div>

            <li>
              <Link 
                to="/user/NotificationPage" 
                onClick={toggleMenu}
                className={`py-3 px-4.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                  isActive("/user/NotificationPage")
                    ? "text-white bg-white/15 border-l-4 border-[#F8E94C] pl-3.5"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>การแจ้งเตือน</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </span>
                <Bell className="w-4.5 h-4.5" />
              </Link>
            </li>
          </ul>
        </div>
      )}

    </nav>
  );
}

export default Navbar;
