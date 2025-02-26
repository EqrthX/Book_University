import { Link } from 'react-router-dom';
import { ShoppingCart, UserRound } from "lucide-react";
import UTCC from "/src/assets/UTCC.png";

function Head() {
  

  return (
    <nav className="bg-white w-full h-20 flex items-center px-6 md:px-12 relative z-10 shadow-md">
        
        {/* Logo  */}
        <Link to="/user/HomePage">
          <img src={UTCC} className="h-16 w-auto object-contain cursor-pointer" alt="UTCC Logo"/>
        </Link>
        <h1 className="text-black font-bold text-lg md:text-2xl ml-4"></h1>

        <div className="ml-auto flex items-center space-x-6">
          
        {/* ตะกร้า */}
          <Link to="/user/BasketPage">
            <button className="text-black p-3 rounded-full hover:bg-gray-200">
              <ShoppingCart className="w-6 h-6" />
            </button>
          </Link>

          {/* โปรไฟล์ */}
           <h1 className="text-black font-bold hidden md:block">2210511106028</h1> {/*รหัสนักศึกษา*/}
          <div className="text-black p-3">
            <UserRound className="w-10 h-10" />
          </div>
        </div>
      </nav>
  );
}

export default Head;
