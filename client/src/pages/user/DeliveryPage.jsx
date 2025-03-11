import React, { useState } from "react";
import Navdar from "./components/Navdar";
import Head from "./components/Head";
import Ems from "/src/assets/Ems.png"; // รูป EMS
import CountAndReceive from "/src/assets/CountAndReceive.png"; // รูป นัดรับ
import Qr_code from "/src/assets/Qr_code.png"; // รูป qr_code
import Cod from "/src/assets/Cod.png"; // รูป ตรง



import { MapPinPlus } from "lucide-react";
import { Link } from "react-router-dom";

function DeliveryPage() {
  const [selected, setSelected] = useState("null"); // State สำหรับเก็บค่าที่เลือก
  const [selectedPayment, setSelectedPayment] = useState(""); // ประกาศตัวแปรสถานะ 'selectedPayment' เพื่อเก็บค่าของวิธีการชำระเงินที่เลือก เริ่มต้นตั้งค่าเป็นค่าว่าง (string ว่าง) ซึ่งหมายถึงยังไม่ได้เลือกวิธีการชำระเงิน

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-10">
      <Head />
      <Navdar />

      {/* ข้อความและ icon */}
      <div className="pt-10 px-6 md:px-30 mt-25">
        <div className="flex items-center mb-6">
          <MapPinPlus className="w-10 h-10 text-[#2d3695]" />
          <h1 className="font-bold text-2xl ml-3">วิธีการจัดส่ง</h1>
        </div>
      </div>

      {/* ตัวเลือกการจัดส่ง */}
      <div className="flex gap-10 p-4 justify-center mt-0">
        {/* กล่องที่ 1 (EMS) */}
        <label
          className={`flex items-center justify-between w-160 ml-10 p-4 bg-white rounded-xl border cursor-pointer transition-all ${
            selected === "ems" ? "border-blue-500 shadow-lg" : "border-gray-300"
          }`}
        >
          <div className="flex items-center gap-4">
            <img src={Ems} alt="EMS" className="w-40 h-auto" />
            <div>
              <h3 className="font-bold">ไปรษณีย์ไทย</h3>
              <p>กรุงเทพและปริมณฑล <b>1 - 3 วัน</b></p>
              <p>ต่างจังหวัด <b>3 - 5 วัน</b></p>
              <p className="text-xs text-red-500">*มีค่าจัดส่ง 40 บาท</p>
            </div>
          </div>
          <input
            type="radio"
            name=" "
            value="ems"
            checked={selected === "ems"}
            onChange={() => setSelected("ems")}
            className="w-6 h-6 accent-blue-600 ml-20"
            required 
          />
        </label>

        {/* กล่องที่ 2 (เจอกันพร้อมจ่าย) */}
        <label
          className={`flex items-center justify-between w-160 p-4 bg-white rounded-xl border cursor-pointer transition-all ${
            selected === "cod" ? "border-blue-500 shadow-lg" : "border-gray-300"
          }`}
        >
          <div className="flex items-center gap-4">
            <img
              src={CountAndReceive}
              alt="Cash on Delivery"
              className="w-30 h-auto"
            />
            <div>
              <h3 className="font-bold">เจอกันพร้อมจ่าย</h3>
              <p>นัดรับที่มหาวิทยาลัยหอการค้าไทย</p>
            </div>
          </div>
          <input
            type="radio"
            name=" "
            value="cod"
            checked={selected === "cod"}
            onChange={() => setSelected("cod")}
            className="w-6 h-6 accent-blue-600"
            required 
          />
        </label>
      </div>

      {/* เมื่อเลือก EMS */}
      {selected === "ems" && (
        <div className="mt-6 flex gap-10 justify-center overflow-x-auto ">
        <div className="p-10 bg-white rounded-2xl shadow-lg w-160 min-w-[300px] ml-13 ">
          <h3 className="font-bold text-xl mb-6">ที่อยู่จัดส่ง</h3>
          <form className="grid grid-cols-3 gap-4">
          <input type="text" placeholder="ชื่อ-นามสกุล" className="col-span-1 w-70 p-3 border-2 border-gray-200 rounded-md" required /> {/*ชื่อ-นามสกุล  */}
            <input type="text" placeholder="บ้านเลขที่" className="col-span-1 w-30 p-3 border-2 border-gray-200 rounded-md ml-28" required /> {/* บ้านเลขที่ */}
            <input type="text" placeholder="ชื่อถนน" className="col-span-1 w-30 p-3 border-2 border-gray-200 rounded-md ml-15" required /> {/* ถนน  */}
            <input type="text" placeholder="หมู่บ้าน/ซอย" className="col-span-1 w-full p-3 border-2 border-gray-200 rounded-md" required /> {/* หมู่บ้าน/ซอย */}
            <input type="text" placeholder="ตำบล/แขวง" className="col-span-1 w-full p-3 border-2 border-gray-200 rounded-md" required /> {/* ตำบล/แขวง  */}
            <input type="text" placeholder="อำเภอ/เขต" className="col-span-1 w-full p-3 border-2 border-gray-200 rounded-md" required /> {/* อำเภอ/เขต  */}
            <input type="text" placeholder="จังหวัด" className="col-span-1 w-full p-3 border-2 border-gray-200 rounded-md" required /> {/* จังหวัด */}
            <input type="text" placeholder="รหัสไปรษณีย์" className="col-span-1 w-full p-3 border-2 border-gray-200 rounded-md" required /> {/* รหัสไปรษณีย์ */}
            <input type="tel" placeholder="เบอร์โทรศัพท์" className="col-span-1 w-full p-3 border-2 border-gray-200 rounded-md" required /> {/* เบอร์โทรศัพท์ */}
            <input type="email" placeholder="example@live4.utcc.ac.th" className="col-span-1 w-60 h-13 p-3 border-2 border-gray-200 rounded-md " required /> {/* อีเมล */}
            <textarea placeholder="เพิ่มเติม" className="col-span-1 w-72 h-13 p-3 border-2 border-gray-200 rounded-md ml-17" />
          </form>
        </div>
      

        
        {/* กรอบวิธีการชำระเงิน */}
        <div className="p-10 bg-white rounded-2xl shadow-lg w-160 min-w-[300px] mr-5 ">
          <h3 className="font-bold text-xl mb-6">วิธีชำระเงิน</h3>
          {/* กรอบ qr code  */}
          <div className="w-full h-24 border-2 border-gray-200 rounded-xl shadow-lg flex items-center p-4 bg-white">
            <input
              type="radio"
              name=" "
              value="qrCode"
              onChange={() => setSelectedPayment("qrCode")}
              checked={selectedPayment === "qrCode"}
              className="w-6 h-6 accent-blue-600 ml-5 items-start"
              required
            />
            <img src={Qr_code} alt="EMS" className="w-15 h-auto ml-5" />
            <h1 className=" text-lg pl-10 " style={{ fontFamily: 'Superstore, sans-serif' }}> QR Code</h1>
          </div>
          
          <div className="flex items-center justify-center ">
            <Link to="/user/PaymentPage">
              <button className="w-70 bg-[#358C1B] text-white px-6 py-2 rounded-lg mt-30 hover:bg-[#2e4427]">
                ชำระเงิน
              </button>
            </Link>
          </div>

        </div>
      </div>
      )}


      {/* เมื่อเลือก เจอกันพร้อมจ่าย */}
      {selected === "cod" && (
          <div className="mt-6 flex gap-10 justify-center overflow-x-auto ">
          <div className="p-10 bg-white rounded-2xl shadow-lg w-160 h-90 min-w-[300px] ml-13 ">
            <h3 className="font-bold text-xl mb-6">ข้อมูลการนัดรับ</h3>
            <form className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="ชื่อ-นามสกุล" className="col-span-1 w-75 p-3 border-2 border-gray-200 rounded-md" required /> {/*ชื่อ-นามสกุล  */}
            <input type="tel" placeholder="เบอร์โทรศัพท์" className="col-span-1 w-60 p-3 border-2 border-gray-200 rounded-md ml-8" required /> {/* เบอร์โทรศัพท์ */}
            <input type="email" placeholder="example@live4.utcc.ac.th" className="col-span-1 w-70 h-13 p-3 border-2 border-gray-200 rounded-md " required /> {/* อีเมล */}
            <input type="text" placeholder="สถานที่นัดรับภายในมหาวิทยาลัย" className="col-span-1 w-65 p-3 border-2 border-gray-200 rounded-md ml-3"required  /> {/* สถานที่นัดรับภายในมหาวิทยาลัย  */}
            <input type="datetime-local" className="text-gray-400 col-span-1 w-65 p-3 border-2 border-gray-200 rounded-md" required /> 
            <textarea placeholder="หมายเหตุ" className="col-span-1 w-68 h-13 p-3 border-2 border-gray-200 rounded-md " /> {/* หมายเหตุ */}
            </form>
          </div>

          {/* กรอบวิธีการชำระเงิน */}
          <div className="p-10 bg-white rounded-2xl shadow-lg w-160 min-w-[300px] mr-5 ">
            <h3 className="font-bold text-xl mb-6">วิธีชำระเงิน</h3>

            {/* กรอบ qr code */}
            <div className="w-full h-24 border-2 border-gray-200 rounded-xl shadow-lg flex items-center p-4 bg-white">
              <input
                type="radio"
                name=" "  
                value="qrCode"
                onChange={''}
                className="w-6 h-6 accent-blue-600 ml-5 items-start"
                required
              />
              <img src={Qr_code} alt="QR Code" className="w-15 h-auto ml-5" />
              <h1 className="text-lg pl-10" style={{ fontFamily: 'Superstore, sans-serif' }}>
                QR Code
              </h1>
            </div>

            {/* กรอบ เก็บเงินปลายทาง */}
            <div className="w-full h-24 border-2 border-gray-200 rounded-xl shadow-lg flex items-center p-4 bg-white mt-5">
              <input
                type="radio"
                name=" "  
                value="cashOnDelivery"
                onChange={''}
                className="w-6 h-6 accent-blue-600 ml-5 items-start"
                required
              />
              <img src={Cod} alt="Cash on Delivery" className="w-15 h-auto ml-5" />
              <h1 className="text-lg pl-10">เก็บเงินปลายทาง</h1>
            </div>

            <div className="flex items-center justify-center ">
              <Link to="/user/PaymentPage">
                <button className="w-70 bg-[#358C1B] text-white px-6 py-2 rounded-lg mt-8 hover:bg-[#2e4427]">
                  ชำระเงิน
                </button>
              </Link>
            </div>
          </div>

        </div>
        )}

    </div>
  );
}

export default DeliveryPage;
