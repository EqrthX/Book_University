import { useEffect, useState } from "react";
import Navdar from "./components/Navdar";
import Head from "./components/Head";
import Ems from "/src/assets/Ems.png"; // รูป EMS
import CountAndReceive from "/src/assets/CountAndReceive.png"; // รูป นัดรับ
import Qr_code from "/src/assets/Qr_code.png"; // รูป qr_code
import Cod from "/src/assets/Cod.png"; // รูป ตรง
import axios from '../../util/axios.js';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MapPinPlus } from "lucide-react";

function DeliveryPage() {
  
  const location = useLocation();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(null); // State สำหรับเก็บค่าที่เลือก
  const [selectedPayment, setSelectedPayment] = useState(""); // ประกาศตัวแปรสถานะ 'selectedPayment' เพื่อเก็บค่าของวิธีการชำระเงินที่เลือก เริ่มต้นตั้งค่าเป็นค่าว่าง (string ว่าง) ซึ่งหมายถึงยังไม่ได้เลือกวิธีการชำระเงิน
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
        price: price
      }
    ]
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
    total_price: totalPrice,
    orderData: Array.isArray(orderData) ? orderData: [
      {
        bookId: bookId,
        quantity: quantity || 1,
        price: price
      }
    ]

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
      console.error("Error: userId is undefiend")
      return;
    }
    
    try {
        let res;

        if(selected === "delivery") {

          res = await axios.post("/add-infomation-order", deliveryInfo, { withCredentials: true })
          
        } else if(selected === "pickup") {
          
          res = await axios.post("/add-infomation-order", pickupInfo, { withCredentials: true })
          
        }

        navigate("/user/PaymentPage",{
          state: {orderId: res.data.orderId}
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
        navigate("/"); // ถ้าไม่มี Token ให้กลับไปหน้า Login
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
    <div className="bg-[#F5F5F5] min-h-screen pb-10">
      <Head studentId={user.studentId}/>
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
            selected === "delivery" ? "border-blue-500 shadow-lg" : "border-gray-300"
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
            name="type"
            value="delivery"
            checked={selected === "delivery"}
            onChange={() => {
              setSelected("delivery")
              setDeliveryInfo(prev => ({ ...prev, type: "delivery"}))
            }}
            className="w-6 h-6 accent-blue-600 ml-20"
          />
        </label>

        {/* กล่องที่ 2 (เจอกันพร้อมจ่าย) */}
        <label
          className={`flex items-center justify-between w-160 p-4 bg-white rounded-xl border cursor-pointer transition-all ${
            selected === "pickup" ? "border-blue-500 shadow-lg" : "border-gray-300"
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
            name="type"
            value="pickup"
            checked={selected === "pickup"}
            onChange={() => {
              setSelected("pickup")
              setPickupInfo(prev => ({...prev, type: "pickup"}))
            }}
            className="w-6 h-6 accent-blue-600"
          />
        </label>

      </div>

      {/* เมื่อเลือก EMS */}
      {selected === "delivery" && (
        <div className="mt-6 flex gap-10 justify-center overflow-x-auto ">
        <div className="p-10 bg-white rounded-2xl shadow-lg w-160 min-w-[300px] ml-13 ">

          <h3 className="font-bold text-xl mb-6">ที่อยู่จัดส่ง</h3>

          <form 
            className="grid grid-cols-3 gap-4"
          >
              <input type="text" 
                placeholder="ชื่อ-นามสกุล" 
                name="fullName" 
                onChange={(e) => handleInputChange(e, "delivery")} 
                value={deliveryInfo.fullName} 
                className="col-span-1 w-70 p-3 border-2 border-gray-200 rounded-md"  
              /> {/*ชื่อ-นามสกุล  */}

              <input 
                type="text" 
                placeholder="บ้านเลขที่" 
                name="house_no" 
                onChange={(e) => handleInputChange(e, "delivery")}  
                value={deliveryInfo.house_no} 
                className="col-span-1 w-30 p-3 border-2 border-gray-200 rounded-md ml-28"  
              /> {/* บ้านเลขที่ */}

              <input 
                type="text" 
                placeholder="ชื่อถนน" 
                name="street" 
                onChange={(e) => handleInputChange(e, "delivery")} 
                value={deliveryInfo.street} 
                className="col-span-1 w-30 p-3 border-2 border-gray-200 rounded-md ml-15"  
              /> {/* ถนน  */}
              
              <input 
                type="text" 
                placeholder="หมู่บ้าน/ซอย" 
                name="zone" 
                onChange={(e) => handleInputChange(e, "delivery")}  
                value={deliveryInfo.zone} 
                className="col-span-1 w-full p-3 border-2 border-gray-200 rounded-md"  
              /> {/* หมู่บ้าน/ซอย */}
              
              <input 
                type="text" 
                placeholder="ตำบล/แขวง" 
                name="subdistrict" 
                onChange={(e) => handleInputChange(e, "delivery")}  
                value={deliveryInfo.subdistrict} 
                className="col-span-1 w-full p-3 border-2 border-gray-200 rounded-md"  
              /> {/* ตำบล/แขวง  */}
              
              <input 
                type="text" 
                placeholder="อำเภอ/เขต" 
                name="district" 
                onChange={(e) => handleInputChange(e, "delivery")}  
                value={deliveryInfo.district} 
                className="col-span-1 w-full p-3 border-2 border-gray-200 rounded-md"  
              /> {/* อำเภอ/เขต  */}
              
              <input 
                type="text" 
                placeholder="จังหวัด" 
                name="province" 
                onChange={(e) => handleInputChange(e, "delivery")}  
                value={deliveryInfo.province} 
                className="col-span-1 w-full p-3 border-2 border-gray-200 rounded-md"  
              /> {/* จังหวัด */}
              
              <input 
                type="text" 
                placeholder="รหัสไปรษณีย์" 
                name="zip_code" 
                onChange={(e) => handleInputChange(e, "delivery")}  
                value={deliveryInfo.zip_code} 
                className="col-span-1 w-full p-3 border-2 border-gray-200 rounded-md"  
              /> {/* รหัสไปรษณีย์ */}
              
              <input 
                type="tel" 
                placeholder="เบอร์โทรศัพท์" 
                name="phone" 
                onChange={(e) => handleInputChange(e, "delivery")}  
                value={deliveryInfo.phone} 
                className="col-span-1 w-full p-3 border-2 border-gray-200 rounded-md"  
                /> {/* เบอร์โทรศัพท์ */}
              
              <input 
                type="email" 
                placeholder="example@live4.utcc.ac.th" 
                name="email" onChange={(e) => handleInputChange(e, "delivery")}  
                value={deliveryInfo.email} 
                className="col-span-1 w-60 h-13 p-3 border-2 border-gray-200 rounded-md " 
              /> {/* อีเมล */}
              
              <textarea 
                placeholder="เพิ่มเติม" 
                name="other" 
                onChange={(e) => handleInputChange(e, "delivery")}  
                value={deliveryInfo.other} 
                className="col-span-1 w-72 h-13 p-3 border-2 border-gray-200 rounded-md ml-17" 
              />
          
          </form>

        </div>
      
        {/* กรอบวิธีการชำระเงิน */}
        <div className="p-10 bg-white rounded-2xl shadow-lg w-160 min-w-[300px] mr-5 ">
          <h3 className="font-bold text-xl mb-6">วิธีชำระเงิน</h3>
          {/* กรอบ qr code  */}
          <div className="w-full h-24 border-2 border-gray-200 rounded-xl shadow-lg flex items-center p-4 bg-white">
            <input
              type="radio"
              name="paymentMethod"
              value="qrCode"
              onChange={() => {
                setSelectedPayment("qrCode")
                setDeliveryInfo(prev => ({ ...prev, paymentMethod: "qrCode" }))
              }}
              checked={selectedPayment === "qrCode"}
              className="w-6 h-6 accent-blue-600 ml-5 items-start"
              
            />
            <img src={Qr_code} alt="EMS" className="w-15 h-auto ml-5" />
            <h1 className=" text-lg pl-10 " style={{ fontFamily: 'Superstore, sans-serif' }}> QR Code</h1>
          </div>
          
          <div className="flex items-center justify-center ">
              <Link
                onClick={handlePayment}
                className={`w-70 text-white text-center px-6 py-2 rounded-lg mt-30 transition-colors ${
                  selected && selectedPayment
                    ? 'bg-[#358C1B] hover:bg-[#2e4427]'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
                disabled={!selected || !selectedPayment}
              >
                ชำระเงิน
              </Link>
          </div>

        </div>
      </div>
      )}


      {/* เมื่อเลือก เจอกันพร้อมจ่าย */}
      {selected === "pickup" && (
          <div className="mt-6 flex gap-10 justify-center overflow-x-auto ">
          <div className="p-10 bg-white rounded-2xl shadow-lg w-160 h-90 min-w-[300px] ml-13 ">
            <h3 className="font-bold text-xl mb-6">ข้อมูลการนัดรับ</h3>
            
            <form className="grid grid-cols-2 gap-4">
              
              <input 
                type="text" 
                placeholder="ชื่อ-นามสกุล" 
                value={pickupInfo.fullName}
                name="fullName"
                onChange={(e) => handleInputChange(e, "pickup")} 
                className="col-span-1 w-75 p-3 border-2 border-gray-200 rounded-md"
              /> {/*ชื่อ-นามสกุล  */}
              
              <input 
                type="tel" 
                placeholder="เบอร์โทรศัพท์"
                name="phone"
                value={pickupInfo.phone}
                onChange={(e) => handleInputChange(e, "pickup")} 
                className="col-span-1 w-60 p-3 border-2 border-gray-200 rounded-md ml-8"
              /> {/* เบอร์โทรศัพท์ */}
              
              <input 
                type="email" 
                placeholder="example@live4.utcc.ac.th" 
                name="email"
                value={pickupInfo.email}
                onChange={(e) => handleInputChange(e, "pickup")} 
                className="col-span-1 w-70 h-13 p-3 border-2 border-gray-200 rounded-md "
              /> {/* อีเมล */}
              
              <input 
                type="text" 
                placeholder="สถานที่นัดรับภายในมหาวิทยาลัย"
                name="location"
                value={pickupInfo.location}
                onChange={(e) => handleInputChange(e, "pickup")} 
                className="col-span-1 w-65 p-3 border-2 border-gray-200 rounded-md ml-3" 
              /> {/* สถานที่นัดรับภายในมหาวิทยาลัย  */}
              
              <input 
                type="datetime-local" 
                className="text-gray-400 col-span-1 w-65 p-3 border-2 border-gray-200 rounded-md"
                name="date_and_time"
                onChange={(e) => handleInputChange(e, "pickup")} 
                value={pickupInfo.date_and_time}  
              /> 
              
              <textarea 
                placeholder="หมายเหตุ" 
                className="col-span-1 w-68 h-13 p-3 border-2 border-gray-200 rounded-md " 
                name="other"
                onChange={(e) => handleInputChange(e, "pickup")} 
                value={pickupInfo.other}
              /> {/* หมายเหตุ */}
            
            </form>

          </div>

          {/* กรอบวิธีการชำระเงิน */}
          <div className="p-10 bg-white rounded-2xl shadow-lg w-160 min-w-[300px] mr-5 ">
            <h3 className="font-bold text-xl mb-6">วิธีชำระเงิน</h3>

            {/* กรอบ qr code */}
            <div className="w-full h-24 border-2 border-gray-200 rounded-xl shadow-lg flex items-center p-4 bg-white">
              <input
                type="radio"
                name="paymentMethod"  
                value="qrCode"
                onChange={() => {
                  setSelectedPayment("qrCode")
                  setDeliveryInfo(prev => ({...prev, paymentMethod: "qrCode"}))
                  setPickupInfo(prev => ({...prev, paymentMethod: "qrCode"}))
                }}
                className="w-6 h-6 accent-blue-600 ml-5 items-start"
                
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
                name="paymentMethod"  
                value="Cash"
                onChange={() => setSelectedPayment('Cash')}
                className="w-6 h-6 accent-blue-600 ml-5 items-start"
                
              />
              <img src={Cod} alt="Cash on Delivery" className="w-15 h-auto ml-5" />
              <h1 className="text-lg pl-10">เก็บเงินปลายทาง</h1>
            </div>

            <div className="flex items-center justify-center">

              <button
                onClick={handlePayment}
                className={`w-70 text-white px-6 py-2 rounded-lg mt-8 transition-colors ${
                  selected && selectedPayment
                    ? "bg-[#358C1B] hover:bg-[#2e4427]"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
                disabled={!selected || !selectedPayment}
              >
                ชำระเงิน
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default DeliveryPage;
