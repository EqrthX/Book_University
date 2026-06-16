import { useEffect, useState } from 'react';
import axios, { SERVER_URL } from '../../util/axios.js';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Trash2, Edit2, ShoppingBag, Plus } from "lucide-react";
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';

const SellHistoryPage = () => {
  const { user, loading } = useAuth();
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const handleShowProductWithUser = async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(`/show-for-user`, { params: { userId: user.id }, withCredentials: true });
      setBooks(res.data.books || []);
    } catch (error) {
      console.error('Error fetching user products:', error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      handleShowProductWithUser();
    }
  }, [user]);

  const deleteBook = async (bookId) => {
    const confirmDelete = window.confirm("ต้องการลบข้อมูลสินค้านี้ใช่ไหม");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`/product/delete-book`, { data: { bookId }, withCredentials: true });
      if (res.status === 200) {
        toast.success("ลบสินค้าสำเร็จ");
        setBooks((prev) => prev.filter(book => book.id !== bookId));
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error("ลบสินค้าไม่สำเร็จ");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="loading loading-spinner loading-lg text-[#2d3695]"></span>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-10 font-sans text-slate-800">
            
      <div className='container mx-auto px-4 md:px-8 pt-8 max-w-5xl'>
        {/* Header Title & Actions */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-8">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-[#2d3695]" />
            <h1 className="text-2xl font-black tracking-tight text-slate-800">ประวัติการลงขาย</h1>
          </div>
          <button 
            onClick={() => navigate('/user/AddBook')}
            className="flex items-center space-x-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-500/10 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>ลงขายหนังสือเรียน</span>
          </button>
        </div>

        {/* Sales inventory container */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
          <h2 className='text-sm font-extrabold text-slate-500 uppercase tracking-wider mb-6'>
            รายการหนังสือที่ลงขายทั้งหมด
          </h2>
          
          <div className="space-y-4">
            {books.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                <ShoppingBag className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-slate-400 text-sm font-medium">ยังไม่มีหนังสือที่ลงขายในขณะนี้</p>
              </div>
            ) : (
              books.map((book) => {
                const bookPic = book.bookPic 
                  ? `${SERVER_URL}/${book.bookPic.replace(/\\/g, "/")}` 
                  : "https://via.placeholder.com/150";

                return (
                  <div key={book.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center">
                      <img className="w-16 h-20 object-cover rounded-lg border border-slate-100" src={bookPic} alt="หนังสือ" />
                      <div className="ml-4 pr-4">
                        <h4 className="font-extrabold text-slate-800 text-sm leading-snug">{book.titleBook}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">รายละเอียด: {book.description || "ไม่มีรายละเอียด"}</p>
                        <p className="text-sm font-black text-blue-600 mt-1.5">{book.price} ฿</p>
                      </div>
                    </div>

                    {/* Status and Edit/Delete controls */}
                    <div className="flex items-center justify-between w-full md:w-auto space-x-6">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold">
                        <span className="text-slate-400">นัดรับ: </span>
                        {book.canMeet === "yes" ? (
                          <span className="bg-yellow-50 text-yellow-700 border border-yellow-100 px-2 py-0.5 rounded-full">
                            ได้
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full">
                            ไม่ได้
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link 
                          to={`/user/UpdateABook/${book.id}`} 
                          className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white border border-slate-100 px-3 py-1.5 rounded-xl transition-all shadow-sm"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>แก้ไข</span>
                        </Link>
                        
                        <button 
                          onClick={() => deleteBook(book.id)} 
                          className="flex items-center space-x-1 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50/50 hover:bg-red-50 border border-red-100 px-3 py-1.5 rounded-xl transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ลบ</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SellHistoryPage;
