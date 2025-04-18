import { useEffect, useState } from 'react';
import axios from '../../util/axios.js';
import { getMessagesStatus } from '../../util/helper.js';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from "lucide-react";
import Head from './components/Head.jsx';
import Navbar from './components/Navdar.jsx';

const statusColor = [
  
  {name: "pending", color: "bg-[#ED1235]"},
  {name: "completed", color: "bg-[#ED702C]"},
  {name: "waiting_delivery", color: "bg-[#ED932C]"},
  {name: "shipping", color: "bg-[#EDD62C]"},
  {name: "shipped", color: "bg-[#26A334]"},
  {name: "delivered", color: "bg-[#6BE500]"},

]

const SellHistoryPage = () => {

  const [studentId, setStudentId] = useState("");
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const [id, setId] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get('/auth/protected', { withCredentials: true });
        setId(res.data.user.id);
        setStudentId(res.data.user.studentId);
        setProfile(res.data.user);

        const resHistoryBook = await axios.get(`/show-history` ,{withCredentials: true})
        console.log(resHistoryBook);
        setBooks(resHistoryBook.data.books)
      } catch (error) {
        console.error("Error fetching user profile", error);
        navigate("/");
      }
    };
    fetchUserProfile();
  }, [navigate]);

    // ประวัติการซื้อ
  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-10">
      <Head studentId={studentId} />
      <Navbar />

      <div className='pt-35 px-6 md:px-30 '>
        {/* icon กับ ข้อความ */}
        <div className="flex items-center mb-6">
          <ShoppingCart className="w-10 h-10 text-[#2d3695]" />
          <h1 className="font-bold text-2xl ml-3">ประวัติการซื้อ</h1>
        </div>

        {/* ข้อมูลหนังสือที่ขาย  // ต้องเปลี่ยน ข้อมูลเป็นข้อมูลที่สั่งซื้อแล้ว */} 
        <div className="bg-white p-6 rounded-lg shadow-md  max-w-8xl mx-auto mt-10 ">
          <h1 className='text-lg font-semibold text-center mb-4'>สินค้าที่ซื้อ</h1>
          <div className="space-y-4 ">
            {books.length === 0 ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-500 text-lg">ไม่มีข้อมูลการซื้อ</p>
              </div>
              ) : (null)
            }
            {books.map((book) => (
                  
                 <div 
                  key={book.bookId} 
                  className="p-4 rounded-lg shadow-sm bg-gray-50 flex justify-between items-center mt-5 hover:shadow-lg transition-shadow duration-300"
                  onClick={() => navigate(`/user/BookDetail/${book.bookId}`)} // เปลี่ยนเส้นทางเมื่อคลิก
                >
                  <div className="flex items-center">
                    <img className="w-28 h-35 mr-4" src={`http://localhost:5001/${book.bookPic}`} alt="หนังสือ" />
                    <div>
                      <p className="font-bold text-gray-800">{book.titleBook}</p>
                      <p className="w-120 font-bold text-gray-600 mt-1 truncate overflow-hidden ">รายละเอียด: {book.description}</p>
                      <p className="font-bold text-gray-600 mt-1">ราคา: {book.price} บาท</p>
                    </div>
                  </div>

                {/* ข้อมูล สถานะว่าข้อความ และcode สี // ชำระเงินเสร็จสิ้น [#ED702C] / รอจัดส่ง [#ED932C] / กำลังจัดส่ง [#EDD62C] / จัดส่งเสร็จสิ้น [#6BE500]  */}
                <div className="w-full md:w-1/3 flex flex-col items-center space-y-3 py-2 -mt-10">
                  <h3 className="flex justify-end">สถานะ </h3>
                    {statusColor.find(status => status.name === book.delivery_status) ? (
                      <div className={`${statusColor.find(status => status.name === book.delivery_status).color} text-white px-6 py-2 w-auto rounded-xl text-center`}>
                        {getMessagesStatus(book.delivery_status)}
                      </div>
                    ) : (
                      <div className={`${statusColor.find(status => status.name === book.delivery_status).color} text-white px-6 py-2 w-auto rounded-xl text-center`}>
                        {getMessagesStatus(book.delivery_status)}
                      </div>
                    )}
                </div>

                <div className='flex gap-3'>
                   <button className='w-auto flex items-center justify-center bg-[#E74615] text-white px-4 py-2 rounded-lg hover:bg-red-500'>ได้รับสินค้าแล้ว</button>
                </div>

               </div>
               
            ))}

          </div>

        </div>
      </div>
    </div>
  );
};

export default SellHistoryPage;
