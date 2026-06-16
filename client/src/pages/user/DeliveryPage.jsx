import { useEffect, useState } from "react";
import Ems from "/src/assets/Ems.png";
import CountAndReceive from "/src/assets/CountAndReceive.png";
import Qr_code from "/src/assets/Qr_code.png";
import Cod from "/src/assets/Cod.png";
import axios from '../../util/axios.js';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MapPinPlus } from "lucide-react";

function DeliveryPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("");
  const { price, bookId, quantity, totalPrice, orderData } = location.state || {} || {orderData: [], totalPrice: 0}

  const [user, setUser] = useState({
    userId: "",
    studentId: "",
  })

  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    house_no: "",
    street: "",
    zone: "",
    subdistrict: "",
    district: "",
    province: "",
    zip_code: "",
    phone: "",
    email: "",
    other: "",
    type: "",
    paymentMethod: "",
    price: price,
    userId: "",
    bookId: bookId,
    quantity: quantity,
    total_price: totalPrice,
    orderData: Array.isArray(orderData) ? orderData: [
      {
        bookId: bookId,     
        quantity: quantity || 1,
        price: price,
      }
    ],
    shipping_cost: 40
  })

  const [pickupInfo, setPickupInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    location: "",
    date_and_time: "",
    other: "",
    type: "",
    paymentMethod: "",
    price: price,
    userId: "",
    bookId: bookId,
    quantity: quantity,
    total_price: totalPrice || 0,
    orderData: Array.isArray(orderData) ? orderData: [
      {
        bookId: bookId,
        quantity: quantity || 1,
        price: price
      }
    ],
    shipping_cost: 0
  })

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "delivery") {
      setDeliveryInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value
      }));
    } else if (type === "pickup") {
      setPickupInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value
      }));
    }
  }
  
  const handlePayment = async (e) => {
    e.preventDefault();
    
    if(!user.userId) {
      console.error("Error: userId is undefined")
      return;
    }
    
    try {
        let res;
        let updatedDeliveryInfo = null
        if(selected === "delivery") {
          updatedDeliveryInfo = {
            ...deliveryInfo,
            totalPrice: deliveryInfo.total_price + deliveryInfo.shipping_cost
          }
          res = await axios.post("/payment/add-infomation-order", updatedDeliveryInfo, { withCredentials: true })

        } else if(selected === "pickup") {
          res = await axios.post("/payment/add-infomation-order", pickupInfo, { withCredentials: true })
        }

        navigate("/user/PaymentPage",{
          state: { 
            orderId: res.data.orderId
          }
        })
        
      } catch (error) {
      console.error("Error sending data to backend", error)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/auth/protected', { withCredentials: true })
        setUser({
          userId: res.data.user.id,
          studentId: res.data.user.studentId,
        })
      } catch (error) {
        console.error("User not authenticated", error);
        navigate("/");
      }
    }

    checkAuth();
  }, [navigate])

  useEffect(() => {
    if (user.userId) {
      setDeliveryInfo(prev => ({ ...prev, userId: user.userId, paymentMethod: selectedPayment }));
      setPickupInfo(prev => ({ ...prev, userId: user.userId, paymentMethod: selectedPayment }));
    }
  }, [user, selectedPayment]);  

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16 font-sans text-slate-800">
            
      {/* Title Header */}
      <div className="pt-24 px-6 md:px-10 max-w-6xl mx-auto mt-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#2d3695]/10 text-[#2d3695] rounded-2xl">
            <MapPinPlus className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl text-slate-800">วิธีการจัดส่งสินค้า</h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">เลือกช่องทางการรับสินค้าและกรอกรายละเอียดข้อมูลติดต่อ</p>
          </div>
        </div>
      </div>

      {/* Delivery type selectors */}
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Option 1: EMS */}
          <label
            className={`flex items-center justify-between p-5 bg-white rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
              selected === "delivery" ? "border-[#2F5792] bg-[#2F5792]/5 shadow-md" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <img src={Ems} alt="EMS" className="w-20 md:w-28 h-auto object-contain" />
              <div>
                <h3 className="font-extrabold text-sm text-slate-800">จัดส่งไปรษณีย์ไทย (EMS)</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">กทม. และปริมณฑล: <b>1 - 3 วัน</b></p>
                <p className="text-[11px] text-slate-500">ต่างจังหวัด: <b>3 - 5 วัน</b></p>
                <p className="text-[11px] text-red-500 font-bold mt-1">*ค่าจัดส่งคิดตามจริง 40 บาท</p>
              </div>
            </div>
            <input
              type="radio"
              name="type"
              value="delivery"
              checked={selected === "delivery"}
              onChange={() => {
                setSelected("delivery")
                setDeliveryInfo(prev => ({ ...prev, type: "delivery"}))
              }}
              className="w-5 h-5 accent-[#2F5792] cursor-pointer"
            />
          </label>

          {/* Option 2: Meet & Pay */}
          <label
            className={`flex items-center justify-between p-5 bg-white rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
              selected === "pickup" ? "border-[#2F5792] bg-[#2F5792]/5 shadow-md" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <img
                src={CountAndReceive}
                alt="Meet and Receive"
                className="w-20 md:w-28 h-auto object-contain"
              />
              <div>
                <h3 className="font-extrabold text-sm text-slate-800">เจอกันพร้อมจ่าย (นัดรับ)</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">นัดหมายวันเวลาและสถานที่รับสินค้า</p>
                <p className="text-[11px] text-slate-500">ภายในมหาวิทยาลัยหอการค้าไทย (UTCC)</p>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">*ไม่มีค่าบริการจัดส่งเพิ่มเติม</p>
              </div>
            </div>
            <input
              type="radio"
              name="type"
              value="pickup"
              checked={selected === "pickup"}
              onChange={() => {
                setSelected("pickup")
                setPickupInfo(prev => ({...prev, type: "pickup"}))
              }}
              className="w-5 h-5 accent-[#2F5792] cursor-pointer"
            />
          </label>

        </div>
      </div>

      {/* When Selecting EMS */}
      {selected === "delivery" && (
        <div className="max-w-6xl mx-auto px-6 md:px-10 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Card: Address Form */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-5 pb-2 border-b border-slate-100">
                📍 ที่อยู่สำหรับจัดส่งพัสดุ
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <input 
                  type="text" 
                  placeholder="ชื่อ-นามสกุล ผู้รับ" 
                  name="fullName" 
                  onChange={(e) => handleInputChange(e, "delivery")} 
                  value={deliveryInfo.fullName} 
                  className="sm:col-span-2 md:col-span-3 w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl p-3 text-xs font-semibold outline-none shadow-sm placeholder-slate-400"  
                  required
                />

                <input 
                  type="text" 
                  placeholder="บ้านเลขที่" 
                  name="house_no" 
                  onChange={(e) => handleInputChange(e, "delivery")}  
                  value={deliveryInfo.house_no} 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl p-3 text-xs font-semibold outline-none shadow-sm placeholder-slate-400"  
                  required
                />

                <input 
                  type="text" 
                  placeholder="ถนน" 
                  name="street" 
                  onChange={(e) => handleInputChange(e, "delivery")} 
                  value={deliveryInfo.street} 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl p-3 text-xs font-semibold outline-none shadow-sm placeholder-slate-400"  
                />
                
                <input 
                  type="text" 
                  placeholder="หมู่บ้าน/ซอย" 
                  name="zone" 
                  onChange={(e) => handleInputChange(e, "delivery")}  
                  value={deliveryInfo.zone} 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl p-3 text-xs font-semibold outline-none shadow-sm placeholder-slate-400"  
                />
                
                <input 
                  type="text" 
                  placeholder="ตำบล/แขวง" 
                  name="subdistrict" 
                  onChange={(e) => handleInputChange(e, "delivery")}  
                  value={deliveryInfo.subdistrict} 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl p-3 text-xs font-semibold outline-none shadow-sm placeholder-slate-400"  
                  required
                />
                
                <input 
                  type="text" 
                  placeholder="อำเภอ/เขต" 
                  name="district" 
                  onChange={(e) => handleInputChange(e, "delivery")}  
                  value={deliveryInfo.district} 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl p-3 text-xs font-semibold outline-none shadow-sm placeholder-slate-400"  
                  required
                />
                
                <input 
                  type="text" 
                  placeholder="จังหวัด" 
                  name="province" 
                  onChange={(e) => handleInputChange(e, "delivery")}  
                  value={deliveryInfo.province} 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl p-3 text-xs font-semibold outline-none shadow-sm placeholder-slate-400"  
                  required
                />
                
                <input 
                  type="text" 
                  placeholder="รหัสไปรษณีย์" 
                  name="zip_code" 
                  onChange={(e) => handleInputChange(e, "delivery")}  
                  value={deliveryInfo.zip_code} 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl p-3 text-xs font-semibold outline-none shadow-sm placeholder-slate-400"  
                  required
                />
                
                <input 
                  type="tel" 
                  placeholder="เบอร์โทรศัพท์ติดต่อ" 
                  name="phone" 
                  onChange={(e) => handleInputChange(e, "delivery")}  
                  value={deliveryInfo.phone} 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl p-3 text-xs font-semibold outline-none shadow-sm placeholder-slate-400"  
                  required
                />
                
                <input 
                  type="email" 
                  placeholder="อีเมลผู้รับ (เช่น example@utcc.ac.th)" 
                  name="email" 
                  onChange={(e) => handleInputChange(e, "delivery")}  
                  value={deliveryInfo.email} 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl p-3 text-xs font-semibold outline-none shadow-sm placeholder-slate-400" 
                  required
                />
                
                <textarea 
                  placeholder="หมายเหตุเพิ่มเติมสำหรับผู้ส่ง..." 
                  name="other" 
                  onChange={(e) => handleInputChange(e, "delivery")}  
                  value={deliveryInfo.other} 
                  className="sm:col-span-2 md:col-span-3 w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl p-3 text-xs font-semibold outline-none shadow-sm placeholder-slate-400 resize-none"
                  rows={3}
                />
              </div>
            </div>
          
            {/* Right Card: Payment */}
            <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-5 pb-2 border-b border-slate-100">
                💳 เลือกวิธีชำระเงิน
              </h3>

              {/* QR Code selection */}
              <label className={`w-full border-2 rounded-2xl shadow-sm flex items-center p-4 bg-white cursor-pointer transition-all ${
                selectedPayment === "qrCode" ? "border-blue-500 bg-blue-50/10" : "border-slate-200 hover:border-slate-300"
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="qrCode"
                  onChange={() => {
                    setSelectedPayment("qrCode")
                    setDeliveryInfo(prev => ({ ...prev, paymentMethod: "qrCode" }))
                  }}
                  checked={selectedPayment === "qrCode"}
                  className="w-5 h-5 accent-[#2F5792]"
                />
                <img src={Qr_code} alt="QR Code" className="w-10 h-auto ml-4 object-contain" />
                <span className="font-bold text-slate-700 text-sm ml-4">Thai QR Payment</span>
              </label>
              
              {/* Payment Summary */}
              <div className="mt-8 bg-slate-50 p-4.5 rounded-2xl flex flex-col gap-2.5 text-xs font-semibold text-slate-600 border border-slate-100 shadow-inner">
                <div className="flex justify-between">
                  <span>ราคาสินค้า</span>
                  <span className="text-slate-800 font-extrabold">{deliveryInfo.total_price} บาท</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2.5">
                  <span>ค่าจัดส่ง EMS</span>
                  <span className="text-slate-800 font-extrabold">+{deliveryInfo.shipping_cost} บาท</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-800 font-black">ยอดชำระเงินรวม</span>
                  <span className="text-[#2F5792] font-black text-sm">{deliveryInfo.total_price + deliveryInfo.shipping_cost} บาท</span>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={handlePayment}
                  className={`w-full text-white text-center py-3 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                    selected && selectedPayment
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                  disabled={!selected || !selectedPayment}
                >
                  ดำเนินการชำระเงิน
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* When Selecting Meet & Receive */}
      {selected === "pickup" && (
        <div className="max-w-6xl mx-auto px-6 md:px-10 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Card: Pickup Form */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-5 pb-2 border-b border-slate-100">
                🤝 ข้อมูลรายละเอียดการนัดรับ
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="ชื่อ-นามสกุล" 
                  value={pickupInfo.fullName}
                  name="fullName"
                  onChange={(e) => handleInputChange(e, "pickup")} 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl p-3 text-xs font-semibold outline-none shadow-sm placeholder-slate-400"
                  required
                />
                
                <input 
                  type="tel" 
                  placeholder="เบอร์โทรศัพท์ติดต่อ"
                  name="phone"
                  value={pickupInfo.phone}
                  onChange={(e) => handleInputChange(e, "pickup")} 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl p-3 text-xs font-semibold outline-none shadow-sm placeholder-slate-400"
                  required
                />
                
                <input 
                  type="email" 
                  placeholder="อีเมลผู้รับ (เช่น example@utcc.ac.th)" 
                  name="email"
                  value={pickupInfo.email}
                  onChange={(e) => handleInputChange(e, "pickup")} 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl p-3 text-xs font-semibold outline-none shadow-sm placeholder-slate-400"
                  required
                />
                
                <input 
                  type="text" 
                  placeholder="ระบุสถานที่นัดรับ (เช่น ใต้ตึก 7, หน้าหอสมุด)"
                  name="location"
                  value={pickupInfo.location}
                  onChange={(e) => handleInputChange(e, "pickup")} 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl p-3 text-xs font-semibold outline-none shadow-sm placeholder-slate-400"
                  required
                />
                
                <div className="sm:col-span-2 flex flex-col">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 ml-1">วันและเวลาที่สะดวกนัดรับสินค้า</label>
                  <input 
                    type="datetime-local" 
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl p-3 text-xs font-semibold outline-none shadow-sm text-slate-600"
                    name="date_and_time"
                    onChange={(e) => handleInputChange(e, "pickup")} 
                    value={pickupInfo.date_and_time}
                    required
                  /> 
                </div>
                
                <textarea 
                  placeholder="หมายเหตุเพิ่มเติม (เช่น รายละเอียดชุดที่ใส่มา)..." 
                  className="sm:col-span-2 w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl p-3 text-xs font-semibold outline-none shadow-sm placeholder-slate-400 resize-none" 
                  name="other"
                  onChange={(e) => handleInputChange(e, "pickup")} 
                  value={pickupInfo.other}
                  rows={3}
                />
              </div>
            </div>

            {/* Right Card: Payment */}
            <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-5 pb-2 border-b border-slate-100">
                💳 เลือกวิธีชำระเงิน
              </h3>

              {/* QR Code */}
              <label className={`w-full border-2 rounded-2xl shadow-sm flex items-center p-4 bg-white cursor-pointer transition-all ${
                selectedPayment === "qrCode" ? "border-blue-500 bg-blue-50/10" : "border-slate-200 hover:border-slate-300"
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"  
                  value="qrCode"
                  onChange={() => {
                    setSelectedPayment("qrCode")
                    setDeliveryInfo(prev => ({...prev, paymentMethod: "qrCode"}))
                    setPickupInfo(prev => ({...prev, paymentMethod: "qrCode"}))
                  }}
                  className="w-5 h-5 accent-[#2F5792]"
                  checked={selectedPayment === "qrCode"}
                />
                <img src={Qr_code} alt="QR Code" className="w-10 h-auto ml-4 object-contain" />
                <span className="font-bold text-slate-700 text-sm ml-4 font-sans">Thai QR Payment</span>
              </label>

              {/* Cash */}
              <label className={`w-full border-2 rounded-2xl shadow-sm flex items-center p-4 bg-white cursor-pointer transition-all ${
                selectedPayment === "Cash" ? "border-blue-500 bg-blue-50/10" : "border-slate-200 hover:border-slate-300"
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"  
                  value="Cash"
                  onChange={() => {
                    setSelectedPayment('Cash')
                    setDeliveryInfo(prev => ({...prev, paymentMethod: "Cash"}))
                    setPickupInfo(prev => ({...prev, paymentMethod: "Cash"}))
                  }}
                  className="w-5 h-5 accent-[#2F5792]"
                  checked={selectedPayment === "Cash"}
                />
                <img src={Cod} alt="Cash on Delivery" className="w-10 h-auto ml-4 object-contain" />
                <span className="font-bold text-slate-700 text-sm ml-4">เก็บเงินปลายทาง / จ่ายสด</span>
              </label>

              {/* Payment Summary */}
              <div className="mt-6 bg-slate-50 p-4.5 rounded-2xl flex flex-col gap-2.5 text-xs font-semibold text-slate-600 border border-slate-100 shadow-inner">
                <div className="flex justify-between">
                  <span>ราคาสินค้า</span>
                  <span className="text-slate-800 font-extrabold">{pickupInfo.total_price} บาท</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2.5">
                  <span>ค่าบริการนัดรับ</span>
                  <span className="text-slate-800 font-extrabold">0 บาท</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-800 font-black">ยอดชำระเงินรวม</span>
                  <span className="text-[#2F5792] font-black text-sm">{pickupInfo.total_price} บาท</span>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={handlePayment}
                  className={`w-full text-white px-6 py-3 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                    selected && selectedPayment
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                  disabled={!selected || !selectedPayment}
                >
                  ดำเนินการชำระเงิน
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default DeliveryPage;
