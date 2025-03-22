import { useEffect, useState } from "react";
import axios from "../../util/axios.js";
import { ShoppingCart } from "lucide-react";
import Head from "./components/Head.jsx";
import Navbar from "./components/Navdar.jsx"; 
import toast from "react-hot-toast";

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
      } catch (error) {
        console.error("Error fetching user profile", error);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("/show-for-user", { withCredentials: true });
        setBooks(res.data.books);
      } catch (error) {
        console.error("Error fetching books", error);
      }
    };
    fetchBooks();
  }, []);


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

        <div className="bg-white p-6 rounded-lg shadow-lg max-w-9xl mx-auto">
          {books.length === 0 ? (
            <p className="text-center text-gray-500">ไม่พบรายการสั่งซื้อ</p>
          ) : (
            books.map((book) => (
              <div
                key={book.id}
                className="p-4 rounded-lg shadow-md bg-gray-50 mt-5 flex flex-col md:flex-row justify-between items-stretch border border-gray-300"
              >
                {/* รูปภาพหนังสือ // นัดรับได้ & ไม่ได้*/}
                <div className="flex flex-col items-center">
                    <div className={`px-4 py-2 ${
                        book.canMeet === "yes" ? "bg-[#F8E94C] text-black" : "bg-[#D93619] text-white"
                    }`}
                    >
                    {book.canMeet === "yes" ? "นัดรับได้" : "นัดรับไม่ได้"}
                    </div>


                {/* รูปหนังสือ */}
                  <img
                    className="w-45 h-55 border border-gray-300 rounded-md mt-2"
                    src={`http://localhost:5001/${book.bookPic}`}
                    alt="หนังสือ"
                  />
                </div>

                {/* ข้อมูลหนังสือและผู้ซื้อ */}
                <div className="w-full md:w-1/3 p-4 flex flex-col h-full">
                  <h1 className="font-bold">ชื่อหนังสือ</h1>
                {/* ชื่อหนังสือ */}
                  <p className="ml-5">{book.titleBook}</p>
                  <h1 className="font-bold mt-3">ชื่อ - นามสกุลผู้ซื้อ</h1>
                {/* ชื่อผู้ซื้อ */}
                  <p className="ml-5">ชัยอนันต์ แย้มต่วน</p>
                  <h1 className="font-bold mt-3">อีเมล</h1>
                {/* อีเมลผู้ซื้อ */}
                  <p className="ml-5">2210511106028@live4.utcc.ac.th</p>

                  {/* ที่อยู่  "นัดรับไม่ได้" */}
                  {book.canMeet !== "yes" && (
                    <>
                      <h1 className="font-bold mt-3">ที่อยู่จัดส่ง</h1>
                    {/* แก้ข้อมูล ให้เป็นที่อยู่จัดส่ง ถ้านัดรับไม่ได้ */}
                      <p className="ml-5 break-words">99/999 ซ.ไก่จิก</p> 
                    </>
                  )}
                </div>

                {/* ข้อมูลการนัดรับ  */}
                {book.canMeet === "yes" && (
                  <div className="w-full md:w-1/3 p-4 flex flex-col h-full">
                    <h1 className="font-bold">สถานที่นัดรับ</h1>
                    
                    {/* แก้ข้อมูล สถานที่นัดรับ ถ้านัดรับได้ */}
                    <p className="ml-5 mt-2 w-50">มหาวิทยาลัยหอการค้าไทย ตึก 3 ชั้น 1 </p>
                    
                    <h1 className="font-bold mt-3">วันที่และเวลานัดรับ</h1>
                    
                    {/* แก้ข้อมูล วัน-เวลานัดรับ ถ้านัดรับได้ */}
                    <div className="flex space-x-2 mt-2 ml-5">
                      <div className="border border-gray-300 rounded-sm px-3 py-1  inline-block w-24 text-center">
                        ข้อมูลวัน
                      </div>
                      <div className="border border-gray-300 rounded-sm px-3 py-1 inline-block w-24 text-center">
                        ข้อมูลเวลา
                      </div>
                    </div>
                  </div>
                )}

                {/* ข้อมูลการชำระเงิน */}
                <div className="w-full md:w-1/3 p-4 flex flex-col h-full">
                  <h1 className="font-bold">ข้อมูลการชำระเงิน</h1>

                {/* แก้ข้อมูล การชำระเงิน  มีชำระผ่าน qr code  กับ เก็บเงินปลายทาง */}
                  <p className="ml-5 mt-2">ชำระเงินผ่าน QR Code</p>

                  <h1 className="font-bold mt-3">วันที่และเวลาโอน</h1>
                  <div className="flex space-x-2 mt-2 ml-5">

                {/* แก้ข้อมูล วัน-เวลา การโอน // ถ้า*/}
                    <div className="border border-gray-300 rounded-sm px-3 py-1 inline-block w-24 text-center">
                      ข้อมูลวัน
                    </div>
                    <div className="border border-gray-300 rounded-sm px-3 py-1 inline-block w-24 text-center">
                      ข้อมูลเวลา
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
    </div>
  );
};

export default OrderPage;
