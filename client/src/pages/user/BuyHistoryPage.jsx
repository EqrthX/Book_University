import { useEffect, useState } from 'react';
import axios from '../../util/axios.js';
import { getMessagesStatus } from '../../util/helper.js';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Calendar } from "lucide-react";
import { useAuth } from '../../context/AuthContext.jsx';

const statusColor = [
  { name: "pending", label: "รอดำเนินการ", bg: "bg-red-50 text-red-700 border-red-100" },
  { name: "completed", label: "ชำระเงินเรียบร้อย", bg: "bg-blue-50 text-blue-700 border-blue-100" },
  { name: "waiting_delivery", label: "รอการจัดส่ง", bg: "bg-amber-50 text-amber-700 border-amber-100" },
  { name: "shipping", label: "กำลังจัดส่ง", bg: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  { name: "shipped", label: "จัดส่งแล้ว", bg: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { name: "delivered", label: "ได้รับสินค้าแล้ว", bg: "bg-teal-50 text-teal-700 border-teal-100" },
];

const BuyHistoryPage = () => {
  const { user, loading } = useAuth();
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const resHistoryBook = await axios.get(`/show-history`, { withCredentials: true });
        setBooks(resHistoryBook.data.books || []);
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      }
    };
    fetchHistory();
  }, []);

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
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-8">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-8 h-8 text-[#2d3695]" />
            <h1 className="text-2xl font-black tracking-tight text-slate-800">ประวัติการสั่งซื้อ</h1>
          </div>
        </div>

        {/* History Book card container */} 
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
          <h2 className='text-sm font-extrabold text-slate-500 uppercase tracking-wider mb-6'>
            รายการคำสั่งซื้อสำเร็จทั้งหมด
          </h2>
          
          <div className="space-y-4">
            {books.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                <ShoppingBag className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-slate-400 text-sm font-medium">ยังไม่มีข้อมูลการซื้อหนังสือเรียน</p>
              </div>
            ) : (
              books.map((book) => {
                const bookPic = book.bookPic 
                  ? `http://localhost:5001/${book.bookPic.replace(/\\/g, "/")}` 
                  : "https://via.placeholder.com/150";

                const currentStatus = statusColor.find(status => status.name === book.delivery_status) || {
                  label: book.delivery_status || "สำเร็จ",
                  bg: "bg-slate-50 text-slate-600 border-slate-100"
                };

                return (
                  <div 
                    key={book.bookId} 
                    className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-sm transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/user/BookDetail/${book.bookId}`)}
                  >
                    {/* Cover & metadata info */}
                    <div className="flex items-center space-x-4">
                      <img className="w-16 h-20 object-cover rounded-lg border border-slate-100" src={bookPic} alt="หนังสือ" />
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm leading-snug">{book.titleBook}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">รายละเอียด: {book.description || "ไม่มีรายละเอียด"}</p>
                        <p className="text-sm font-black text-blue-600 mt-1.5">{book.price} ฿</p>
                      </div>
                    </div>

                    {/* Status badges */}
                    <div className="flex items-center justify-between w-full md:w-auto space-x-6">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold">
                        <span className="text-slate-400">สถานะ: </span>
                        <span className={`px-2.5 py-0.5 rounded-full border ${currentStatus.bg}`}>
                          {getMessagesStatus(book.delivery_status) || currentStatus.label}
                        </span>
                      </div>

                      <button className="flex items-center space-x-0.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white border border-slate-100 px-3 py-1.5 rounded-xl transition-all shadow-sm">
                        <span>ดูรายละเอียด</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
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

export default BuyHistoryPage;
