import { Link } from 'react-router-dom';
import { ShoppingCart, UserRound } from "lucide-react";
import UTCC from "/src/assets/UTCC.png";

function Head({ studentId }) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white h-20 flex items-center px-6 md:px-12 z-50 shadow-md">
      
      {/* Logo */}
      <Link to="/user/HomePage">
        <img src={UTCC} className="h-16 w-auto object-contain cursor-pointer" alt="UTCC Logo"/>
      </Link>

      <div className="ml-auto flex items-center space-x-6">
        
        {/* ตะกร้า */}
        <Link to="/user/BasketPage">
          <button className="text-black p-3 rounded-full hover:bg-gray-200">
            <ShoppingCart className="w-6 h-6" />
          </button>
        </Link>

        {/* โปรไฟล์ */}
        <h1 className="text-black font-bold hidden md:block">{studentId}</h1> {/*รหัสนักศึกษา*/}
        <div className="text-black p-3">
          <Link to="/user/ProfilePage">
            <UserRound className="w-10 h-10" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Head;


