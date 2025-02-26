//import { useEffect } from 'react'
//import { useNavigate } from 'react-router-dom'
//import axios from '../../util/axios.js'

import Navdar from "./components/Navdar";
import Head from "./components/Head";
import { Book } from "lucide-react";
import { Link } from "react-router-dom";

import Book1 from "/src/assets/Book1.jpg"; // รูปหนังสือ

const DetailsPage = () => {

    /*const navigate = useNavigate();

      useEffect(() => {
          const checkAuth = async () => {
          try {
              const res = await axios.get('/auth/protected', {withCredentials: true})
              console.log(res);
          } catch (error) {
              console.error("User not authenticated", error);
              navigate("/login"); // ถ้าไม่มี Token ให้กลับไปหน้า Login
          }
          }

          checkAuth()
      },[navigate])*/

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <Head />
      <Navdar />
      
      {/* icon รายละเอียด */}
      <div className="flex flex-col items-start px-6 md:px-10 ml-15">
        <div className="flex items-center mb-4">
          <div className="text-[#2d3695] py-5">
            <Book className="w-10 h-10" />
          </div>
          <h1 className="font-bold text-2xl ml-3">รายละเอียด</h1>
        </div>
      </div>

      {/* กรอบสีขาว */}
      <div className="flex justify-center px-4 md:px-10">
        <div className="w-full max-w-5xl bg-white flex flex-col rounded-2xl shadow-lg p-6">

  
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between space-y-6 md:space-y-0">
              {/* รูปหนังสือ */}
              <div className="w-full md:w-1/3 flex justify-center">
                <img className="w-48 h-64 md:w-60 md:h-80 object-cover rounded-lg" src={Book1} alt="หนังสือ" />
              </div>

              {/* ข้อมูลหนังสือ */}
              <div className="w-full md:w-1/3 text-center md:text-left mt-20">
                <h1 className="text-xl font-bold truncate">ชื่อหนังสือ</h1>
                <p className="text-black break-words whitespace-normal mt-2">
                  รายละเอียดหนังสือ : 
                </p>

                <p className="text-black text-sm mt-2">รหัสวิชา: GE-224</p>
              </div>

              {/* กรอบสีเหลืองนัดรับได้ */}
              <div className="w-full md:w-1/3 flex flex-col items-center md:items-end space-y-3">
                <div className="bg-[#F8E94C] text-black px-4 py-2 font-semibold">
                  นัดรับได้
                </div>
              </div>
              {/* ราคา */}
              <div className="text-2xl font-bold text-black mt-70 mr-5">300฿</div>
          </div>

          {/* ปุ่ม */}
          <div className="flex flex-col md:flex-row justify-center md:justify-end mt-6 space-y-3 md:space-y-0 md:space-x-4">
            <button className="bg-[#358C1B] text-white px-6 py-2 rounded-md w-full md:w-auto">
              เพิ่มตะกร้า
            </button>
            <Link to="">
              <button className="bg-[#D93619] text-white px-6 py-2 rounded-md w-full md:w-auto">
                ซื้อหนังสือ
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
