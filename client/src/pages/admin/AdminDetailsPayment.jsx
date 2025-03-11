import React from 'react';
import BGUni from "../../assets/bg.jpeg";

function AdminDetailsPayment() {
  return (
    <div className="w-full min-h-screen relative flex flex-col items-center p-10">
      {/* พื้นหลัง */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${BGUni})`,
          backgroundColor: "#3B82F6",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
        }}
      ></div>
        {/* ข้อความ ตรวจสอบสถานะการเงิน */}
      <div className="absolute inset-0 bg-[#405d81] opacity-50"></div>
      <div className="relative p-10 z-10">
        <h3 className="font-semibold text-3xl text-black pr-180 mb-6 mt-3 ">ตรวจสอบสถานะการเงิน</h3>
        
         {/* ปุ่มการดำเนินการ 3 ปุ่ม บน*/}
         <div className="flex items-end justify-end space-x-5 mx-7 ">
            <button className="bg-[#26A334] hover:bg-[#355c3a] text-white px-4 py-2 rounded">อนุมัติ</button>
            <button className="bg-[#D93619] hover:bg-[#A80F0F] text-white px-4 py-2 rounded">ไม่อนุมัติ</button>
            <button className="bg-[#E3CC18] hover:bg-[#A89214] text-black hover:text-white px-4 py-2 rounded">แจ้งปัญหา</button>
        </div>


      </div>

       
      {/* เนื้อหาหลัก */}
        <div className="relative bg-[#F4F4F4] p-8 shadow-lg w-full h-205 max-w-5xl -my-5 rounded-sm">
            
                {/* ข้อมูลคำสั่งซื้อ */}
                <div className="grid grid-cols-2 gap-4 text-gray-700">

                    <div className="flex flex-col items-center mt-5">
                        <h3 className="mb-2 font-bold ">หนังสือ</h3>
                        {/* รูปหนังสือ */}
                        <div className="w-50 h-60 bg-white border-2 border-gray-400 rounded flex justify-center items-center"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 my- mt-20 text-black  ">

                        {/* หมายเลขคำสั่งซื้ออยู่ข้างบน */}
                        <div>
                        <u><p className="font-medium">หมายเลขคำสั่งซื้อ</p></u>
                        <p className='ml-7'>2904830125</p>
                        </div>

                        {/* อันนี้ทำหรอกไม่ได้ใช้ */}
                        <div><p className="font-medium"></p><p></p></div>
                        
                        {/* ชื่อ - นามสกุลผู้ซื้อ */}
                        <div>
                            <p className="font-medium">ชื่อ - นามสกุลผู้ซื้อ</p>
                            <p className='ml-7'>อ้วน นามสมมุติ</p>
                        </div>

                        {/* ชื่อ - นามสกุลผู้ขาย */}
                        <div>
                            <p className="font-medium">ชื่อ - นามสกุลผู้ขาย</p>
                            <p className='ml-7'>ผอม นามสมมุติ</p>
                        </div>

                        {/* อีเมล ผู้ซื้อ */}
                        <div>
                            <p className="font-medium">อีเมลผู้ซื้อ</p>
                            <p className='ml-7'>dhjehfkfj@gmail.com</p>
                        </div>

                        {/* อีเมล ผู้ขาย */}
                        <div>
                            <p className="font-medium">อีเมลผู้ขาย</p>
                            <p className='ml-7'>ejfejifefjk@gmail.com</p>
                        </div>
                    </div>
                </div>


                {/* ข้อมูลการชำระเงิน */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 mt-20 mx-35">ข้อมูลการชำระเงิน</h4>
                    <div className='ml-50'>
                        <h1 className="font-medium text-lg ">ชำระเงิน</h1>
                        <p className="mt-2 ml-7 ">QR Code</p>
                    </div>

                        <div className="grid grid-cols-2 gap-2 mt-10 ml-50 ">
                            <div className="flex flex-col">
                            
                            {/* ข้อมูลวันที่และเวลาการโอน */}
                            <p className="font-medium">วันที่และเวลาการโอน</p>
                            <div className="flex gap-2 mt-3">
                                <input type="date" className="border-2 border-gray-300 p-2 rounded w-1/3 ml-7" />
                                <input type="time" className="border-2 border-gray-300 p-2 rounded w-1/4" />
                            </div>

                            {/* ข้อมูลสถานะการชำระเงิน */}
                            <p className="font-medium mt-7">สถานะการชำระเงิน</p>
                            <input type="text" className="border-2 border-gray-300 p-2 rounded-sm w-50 mt-3 ml-7"  />
                        </div>

                            {/* รูปหลักฐานการโอน */}
                            <div className="flex flex-col -my-30">
                                <p className="text-lg mb-3 -mx-7 ">หลักฐานการโอน</p>
                                <div className="w-70 h-80 bg-white border-2 border-gray-400 rounded flex "></div>
                            </div>
                        </div>
                </div>
        </div>
    </div>
  );
}

export default AdminDetailsPayment;
