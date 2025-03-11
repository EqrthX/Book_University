import React, { useState } from 'react';
import Head from './components/Head';
import Navdar from './components/Navdar';
import Qr_code from "/src/assets/Qr_code.png"; // รูป QR Code
import { Link } from 'react-router-dom';
import { Banknote, FileDown } from 'lucide-react';

function PaymentPage() {
  // เก็บไฟล์ที่เลือก
  const [selectedFile, setSelectedFile] = useState(null);

  // ฟังก์ชันอัปโหลดไฟล์
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-10">
      <Head />
      <Navdar />

      {/* ข้อความและ icon */}
      <div className="pt-10 px-6 md:px-30 mt-25">
        <div className="flex items-center mb-6">
          <Banknote className="w-10 h-10 text-[#2d3695]" />
          <h1 className="font-bold text-2xl ml-3">ชำระเงิน</h1>
        </div>
      </div>

      {/* กรอบสีขาว */}
        <div className="flex justify-center px-4 md:px-10">
            <div className="w-full max-w-7xl bg-white flex flex-col rounded-2xl shadow-lg p-10 md:p-20">
        
                {/* ส่วนหลัก แบ่งเป็น 3 ส่วน (QR Code / อัปโหลดไฟล์ / ช่องกรอกข้อมูล) */}
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 w-full">
                    
                    {/* รูป QR Code */}
                    <div className="w-full md:w-1/3 flex justify-start">
                        <div className="w-80 h-auto border-2 border-gray-300 p-5 rounded-2xl flex flex-col items-center justify-center">
                            <img className="w-full h-auto object-cover rounded-lg" src={Qr_code} alt="QrCode" />
                            <h1 className="text-3xl font-bold mt-6 text-center p-5" style={{ fontFamily: 'Superstore, sans-serif' }}>
                                QR Code
                            </h1>
                        </div>
                    </div>

                    {/* อัปโหลดไฟล์รูป */}
                    <div className="flex flex-col items-center">
                        <h1 className="font-bold text-xl mb-2 p-6 pl-50">อัปโหลดสลิปเงิน</h1>
                        <div className="w-64 h-80 border-2 border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center">
                            <FileDown className="w-10 h-10 text-gray-500" />
                            <label className="mt-3 px-4 py-2 border-2 border-gray-500 rounded-lg text-gray-500 cursor-pointer">
                                เพิ่มรูป
                                <input 
                                    className="hidden" 
                                    type="file" 
                                    accept="image/jpeg, image/png"
                                    onChange={handleFileChange} 
                                />
                            </label>
                        </div>
                        <h5 className="text-sm text-red-500 mt-2 pr-30">* JPEG, PNG</h5>
                    </div>

                    {/* ช่องกรอกข้อมูลโอนเงิน */}
                    <div className="flex flex-col items-start mt-30">

                        {/*วัน/เดือน/ปี*/ }
                        <label className="text-lg pl-5">วัน/เดือน/ปี ที่โอนเงิน</label>
                        <div className="flex space-x-2 mt-2">
                            <input type="date" className="border p-2 rounded-sm w-60 text-center text-gray-500 hover:text-black" />
                          
                        </div>

                        {/*เวลโอนเงิน*/ }
                        <label className=" text-lg mt-4 pl-5">เวลาโอนเงิน</label>
                        <div className="flex space-x-2 mt-2">
                            <input type="time" className="border p-2 rounded-sm w-35 text-center text-gray-500 hover:text-black"  />
                        </div>

                        {/* ปุ่มยืนยัน */}
                        <Link to = ''> 
                        <button className="bg-[#358C1B] hover:bg-green-700 text-white px-20 py-2 rounded-md w-full md:w-auto ml-7 mt-25">
                            ยืนยัน
                        </button>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
}

export default PaymentPage;
