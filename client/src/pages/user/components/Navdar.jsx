import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";

function Navdar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const search = () => alert("กำลังค้นหา...");

  return (
    <nav className="bg-gradient-to-r from-[#FFFFFF] via-[#2F5792] to-[#2F5792] h-20 flex items-center px-6 md:px-10">
      
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
        <ul className="flex space-x-10">
          <li><Link to="" className="text-white font-bold hover:underline">แชทพูดคุย</Link></li>
          <li><Link to="" className="text-white font-bold hover:underline">ประวัติการซื้อ/ขาย</Link></li>
          <li><Link to="/user/AddBook" className="text-white font-bold hover:underline">ต้องการขาย</Link></li>
        </ul>
      </div>

      {/* เมนูบนมือถือ */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#2F5792] p-4 md:hidden">
          <ul className="space-y-4 text-center text-white font-bold">
            <li><Link to="" onClick={toggleMenu}>แชทพูดคุย</Link></li>
            <li><Link to="" onClick={toggleMenu}>ประวัติการซื้อ/ขาย</Link></li>
            <li><Link to="/user/AddBook" onClick={toggleMenu}>ต้องการขาย</Link></li>
          </ul>
        </div>
      )}
      
    </nav>
  );
}

export default Navdar;
