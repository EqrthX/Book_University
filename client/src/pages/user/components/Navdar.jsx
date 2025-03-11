import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X, ChevronDown } from "lucide-react";

function Navdar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);


  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleHistory = () => setHistoryOpen(!historyOpen);
  const search = () => alert("กำลังค้นหา...");

  return (
    <nav className="relative top-20 left-0 w-full bg-gradient-to-r from-[#FFFFFF] via-[#2F5792] to-[#2F5792] h-20 flex items-center px-6 md:px-10 z-40 shadow-md">
      
       {/* ปุ่มเมนู (แสดงเฉพาะบนมือถือ) */}
       <button onClick={toggleMenu} className="md:hidden text-black">
        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* ช่องค้นหา */}
      <div className="bg-white w-full sm:w-[300px] ml-4 md:ml-20 px-4 py-2 border border-black flex items-center space-x-3 rounded-full">
        <button onClick={search} className="text-black">
          <Search className="w-5 h-5 cursor-pointer hover:text-red-600" />
        </button>
        <input
          type="text"
          className="outline-none flex-1 bg-transparent"
          placeholder="ค้นหา..."
        />
      </div>

      {/* เมนูหลัก (แสดงปกติบนเดสก์ท็อป) */}
      <div className="hidden md:flex ml-auto pr-20">
        <ul className="flex space-x-10 relative">
          <li><Link to="" className="text-white font-bold hover:underline">แชทพูดคุย</Link></li>
          <li className="relative">
            <button onClick={toggleHistory} className="text-white font-bold hover:underline flex items-center">
              ประวัติ <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {historyOpen && (
              <ul className="absolute left-0 top-full mt-2 bg-white text-black shadow-md rounded-md w-40 p-2">
                <li><Link to="/user/BuyHistoryPage" className="block px-4 py-2 hover:bg-gray-300 rounded-sm">ประวัติการซื้อ</Link></li>
                <li><Link to="/user/SellHistoryPage" className="block px-4 py-2 hover:bg-gray-300  rounded-sm">ประวัติการขาย</Link></li>
              </ul>
            )}
          </li>
          <li><Link to="/user/AddBook" className="text-white font-bold hover:underline">ต้องการขาย</Link></li>
        </ul>
      </div>

      {/* เมนูบนมือถือ */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#2F5792] p-4 md:hidden">
          <ul className="space-y-4 text-center text-white font-bold">
            <li><Link to="" onClick={toggleMenu}>แชทพูดคุย</Link></li>
            <li>
              <button onClick={toggleHistory} className="flex items-center justify-center w-full">
                ประวัติ <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {historyOpen && (
                <ul className="mt-2 bg-white text-black shadow-md rounded-md p-2">
                  <li><Link to="/user/BuyHistoryPage" onClick={toggleMenu} className="block px-4 py-2 hover:bg-gray-300 rounded-sm">ประวัติการซื้อ</Link></li>
                  <li><Link to="/user/SellHistoryPage" onClick={toggleMenu} className="block px-4 py-2 hover:bg-gray-300 rounded-sm">ประวัติการขาย</Link></li>
                </ul>
              )}
            </li>
            <li><Link to="/user/AddBook" onClick={toggleMenu}>ต้องการขาย</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navdar;
