import { useEffect, useState } from "react";
import axios from "../../util/axios.js";
import { ShoppingCart } from "lucide-react";
import Head from "./components/Head.jsx";
import Navbar from "./components/Navdar.jsx"; 

const getMessagePayment = (paymentStatus) => {
  switch (paymentStatus) {
    case "qrCode":
      return "QR Code"
    case "Cash":
      return "เงินสด"
    default:
      break;
  }
}
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
const OrderPage = () => {
  
  const [studentId, setStudentId] = useState("");
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("/auth/protected", { withCredentials: true });
        setStudentId(res.data.user.studentId);
        setProfile(res.data.user);

        const resBookHistoryOrder = await axios.get("/show-history-order", {withCredentials: true})

        console.log(resBookHistoryOrder.data.historyOrder);
        setBooks(resBookHistoryOrder.data.historyOrder)
      } catch (error) {
        console.error("Error fetching user profile", error);
      }
    };
    fetchUserProfile();
  }, []);

  const deliveryOrders = books.filter((book) => book.type === "delivery")
  const pickupOrders = books.filter((book) => book.type ===   "pickup")

//   รายการคำสั่งซื้อเมื่อผู้ซื้อกดซื้อแล้ว ออเดอร์จะส่งข้อมูลมาให้ผู้ขาย
  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <Head studentId={studentId} />
      <Navbar />

    {/* icon กับ ข้อความ */}
      <div className="pt-16 px-6 md:px-20 mt-20">
        <div className="flex items-center mb-6">
          <ShoppingCart className="w-10 h-10 text-[#2d3695]" />
          <h1 className="font-bold text-2xl ml-3">รายการสั่งซื้อ</h1>
        </div>

        {/* การจัดส่ง */}
        {deliveryOrders.length === 0 ? (
          <p className="text-center text-gray-500 animate-bounce">ไม่มีข้อมูลลการจัดส่ง</p>
        ) : (
          deliveryOrders.map((book) => (
            <div
              key={book.id}
                className="p-4 rounded-lg shadow-md bg-gray-50 mt-5 flex flex-col md:flex-row justify-between items-stretch border border-gray-300"
            > 
            
              <div className="flex flex-col items-center ">
                <div className={`px-4 py-2 ${
                        book.type === "pickup" ? "bg-[#F8E94C] text-black" : "bg-[#D93619] text-white"
                    }`}
                    >
                    {book.type === "pickup" ? "นัดรับได้" : "นัดรับไม่ได้"}
                </div>
                  <img
                    className="w-45 h-55 border border-gray-300 rounded-md mt-2"
                    src={`http://localhost:5001/${book.bookPic}`}
                    alt="หนังสือ"
                  />
                </div>
            

              <div className="w-full md:w-1/3 p-4 flex flex-col h-full">
                  <h1 className="font-bold">ชื่อหนังสือ</h1>
                  <p className="ml-5">{book.titleBook}</p>

                  <h1 className="font-bold mt-3">ชื่อ - นามสกุลผู้ซื้อ</h1>
                  <p className="ml-5">{book.Address_full_name}</p>

                  <h1 className="font-bold mt-3">อีเมล</h1>
                  <p className="ml-5">{book.Address_email}</p>

                  <h1 className="font-bold mt-3">ที่อยู่จัดส่ง</h1>
                  <p className="ml-5 break-words">
                    {book.house_no}, {book.street}, {book.zone}, {book.subdistrict}, {book.district}, {book.province}, {book.zip_code}
                  </p>
              </div>
              <div className="w-full md:w-1/3 p-4 flex flex-col h-full">
                  <h1 className="font-bold">ข้อมูลการชำระเงิน</h1>
                  <p className="ml-5 mt-2">ชำระเงินผ่าน {getMessagePayment(book.payment_method)}</p>

                  <h1 className="font-bold mt-3">วันที่และเวลาโอน</h1>
                  <div className="flex space-x-2 mt-2 ml-5">
                    <div className="border border-gray-300 rounded-sm px-6 py-1 inline-block w-42 text-center">
                      {book.payment_datetime ? formatDate(book.payment_datetime) : "ไม่มีข้อมูล"}
                    </div>
                    <div className="border border-gray-300 rounded-sm px-6 py-1 inline-block w-42 text-center">
                      {book.payment_datetime ? formatTime(book.payment_datetime) : "ไม่มีข้อมูล"}
                    </div>
                  </div>
                  <h1 className="font-bold mt-3">สถานะการชำระเงิน</h1>
                
                {/* แก้ข้อมูล สถานะการชำระเงิน */}
                  <div className="border border-gray-300 rounded-md px-2 py-1 w-40 mt-2 text-center ml-5">
                    สถานะการชำระเงิน
                  </div>
              </div>
            </div>
          ))
        )}


        {pickupOrders.length === 0 ? (
          <p className="text-center text-gray-500">ไม่พบรายการสั่งซื้อ</p>
        ) : (
          pickupOrders.map((book) => (
            <div
              key={book.id}
              className="p-4 rounded-lg shadow-md bg-gray-50 mt-5 flex flex-col md:flex-row justify-between items-stretch border border-gray-300"
            >
              {/* รูปภาพหนังสือ */}
              <div className="flex flex-col items-center ">
                <div
                  className={`px-4 py-2 ${
                    book.type === "pickup" ? "bg-[#F8E94C] text-black" : "bg-[#D93619] text-white"
                  }`}
                >
                  {book.type === "pickup" ? "นัดรับได้" : "นัดรับไม่ได้"}
                </div>
                <img
                  className="w-45 h-55 border border-gray-300 rounded-md mt-2"
                  src={`http://localhost:5001/${book.bookPic}`}
                  alt="หนังสือ"
                />
              </div>

              {/* ข้อมูลหนังสือและผู้ซื้อ */}
              <div className="w-full md:w-1/3 p-4 flex flex-col h-full">
                <h1 className="font-bold">ชื่อหนังสือ</h1>
                <p className="ml-5 ">{book.titleBook}</p>

                <h1 className="font-bold mt-3">ชื่อ - นามสกุลผู้ซื้อ</h1>
                <p className="ml-5 ">{book.fullName}</p>

                <h1 className="font-bold mt-3">อีเมล</h1>
                <p className="ml-5 ">{book.email}</p>

              </div>

              <div className="w-full md:w-1/3 p-4 flex flex-col h-full">
                <h1 className="font-bold">สถานที่นัดรับ</h1>
                <p className="ml-5 mt-2 w-50">{book.location || "ไม่มีข้อมูล"}</p>

                <h1 className="font-bold mt-3">วันที่และเวลานัดรับ</h1>

                <div className="flex space-x-2 mt-2 ml-5">
                  <div className="border border-gray-300 rounded-sm px-6 py-1 inline-block w-42 text-center mt-2">
                    {book.pickup_datetime ? formatDate(book.pickup_datetime) : "ไม่มีข้อมูล"}
                  </div>
                  <div className="border border-gray-300 rounded-sm px-6 py-1 inline-block w-42 text-center mt-2">
                    {book.pickup_datetime ? formatTime(book.pickup_datetime) : "ไม่มีข้อมูล"}
                  </div>
                </div>

              </div>

              {/* ข้อมูลการชำระเงิน */}
              <div className="w-full md:w-1/3 p-4 flex flex-col h-full">
                <h1 className="font-bold">ข้อมูลการชำระเงิน</h1>
                <p className="ml-5 mt-2">ชำระเงินผ่าน {getMessagePayment(book.payment_method)}</p>

                <h1 className="font-bold mt-3">วันที่และเวลาที่ชำระเงิน</h1>

                <div className="flex space-x-2 mt-2 ml-5">
                  <div className="border border-gray-300 rounded-sm px-6 py-1 inline-block w-42 text-center mt-2">
                    {book.pickup_datetime ? formatDate(book.payment_datetime) : "ไม่มีข้อมูล"}
                  </div>
                  <div className="border border-gray-300 rounded-sm px-6 py-1 inline-block w-42 text-center mt-2">
                    {book.pickup_datetime ? formatTime(book.payment_datetime) : "ไม่มีข้อมูล"}
                  </div>
                </div>

                <h1 className="font-bold mt-3">สถานะการชำระเงิน</h1>
                
                {/* แก้ข้อมูล สถานะการชำระเงิน */}
                <div className="border border-gray-300 rounded-md px-2 py-1 w-40 mt-2 text-center ml-5">
                    สถานะการชำระเงิน
                </div>

              </div>
            </div>
          ))
        )}

        </div>
      </div>
  );
};

export default OrderPage;
