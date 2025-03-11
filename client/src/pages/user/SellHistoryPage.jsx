import { useEffect, useState } from 'react';
import axios from '../../util/axios.js';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from "lucide-react";
import Head from './components/Head.jsx';
import Navbar from './components/Navdar.jsx';
import toast from 'react-hot-toast';

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
      } catch (error) {
        console.error("Error fetching user profile", error);
        navigate("/");
      }
    };
    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    const handleShowProductWithUser = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`/show-for-user`, { params: { userId: id }, withCredentials: true });
        if (res.data.books.length === 0) {
          toast.error("Books not found");
        } else {
          setBooks(res.data.books);
        }
      } catch (error) {
        console.error('Error fetching user product', error);
      }
    };
    if (id) {
      handleShowProductWithUser();
    }
  }, [id]);

  const deleteBook = async (bookId) => {
    const confirmDelete = window.confirm("ต้องการลบข้อมูลสินค้านี้ใช่ไหม");
    if (!confirmDelete) return;
    try {
      const res = await axios.delete(`/delete-book`, { data: { bookId }, withCredentials: true });
      if (res.status === 200) {
        toast.success("ลบสินค้าสำเร็จ");
        setBooks(books.filter(book => book.id !== bookId));
      }
    } catch (error) {
      console.error('Error deleting book', error);
    }
  };

  if (!studentId) {
    return <div className='text-5xl text-center animate-bounce mt-10'>Loading...</div>;
  }


      // ประวัติการขาย
  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-10">
      <Head studentId={studentId} />
      <Navbar />

      <div className='pt-35 px-6 md:px-30 '>
        {/* icon กับ ข้อความ */}
        <div className="flex items-center mb-6">
          <ShoppingCart className="w-10 h-10 text-[#2d3695]" />
          <h1 className="font-bold text-2xl ml-3">ประวัติการขาย</h1>
        </div>

        {/* ข้อมูลหนังสือที่ขาย */}
        <div className="bg-white p-6 rounded-lg shadow-md  max-w-8xl mx-auto mt-10 ">
          <h1 className='text-lg font-semibold text-center mb-4'>สินค้าที่ขาย</h1>
          <div className="space-y-4">
            {books.map((book) => (
                 <div key={book.id} className="p-4  rounded-lg shadow-sm bg-gray-50 flex justify-between items-center mt-5">
                 <div className="flex items-center">
                   <img className="w-28 h-35 mr-4" src={`http://localhost:5001/${book.bookPic}`} alt="หนังสือ" />
                   <div>
                     <p className="font-bold text-gray-800">{book.titleBook}</p>
                     <p className="w-120 font-bold text-gray-600 mt-1 truncate overflow-hidden ">รายละเอียด: {book.description}</p>
                     <p className="font-bold text-gray-600 mt-1">ราคา: {book.price} บาท</p>
                   </div>
                 </div>

                {/* ข้อมูล สถานะว่า มีสินค้า [#ED702C] / ขายแล้ว รอจัดส่ง [#ED932C] / กำลังจัดส่ง [#EDD62C] / จัดส่งเสร็จสิ้น [#6BE500]  */}
                <div className="w-full md:w-1/3 flex flex-col items-center space-y-3 py-2 -mt-10">
                <h3 className="flex justify-end">สถานะ </h3>
                  {book.canMeet === "yes" ? (
                    <div className="bg-[#F8E94C] text-black px-6 py-2 w-auto rounded-xl text-center">
                      นัดรับได้
                    </div>
                  ) : (
                    <div className="bg-[#D93619] text-white px-6 py-2 w-auto rounded-xl text-center">
                      นัดรับไม่ได้
                    </div>
                  )}
                </div>

                 <div className='flex gap-3'>
                   <Link to={`/user/UpdateABook/${book.id}`} className='w-25 flex items-center justify-center bg-[#3D6299] text-white px-4 py-2 rounded-lg hover:bg-[#2d3446] '>แก้ไข</Link>
                   <button onClick={() => deleteBook(book.id)} className='w-25 flex items-center justify-center bg-[#D93619] text-white px-4 py-2 rounded-lg hover:bg-red-500'>ลบ</button>
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
