import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios, { SERVER_URL } from '../../util/axios.js';
import { Book, MessageSquareText } from "lucide-react";
import toast from 'react-hot-toast';

const DetailsPage = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");
  const { id } = useParams();
  const [book, setBook] = useState({});

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/auth/protected', { withCredentials: true });
        setStudentId(res.data.user.studentId);
      } catch (error) {
        console.error("User not authenticated", error);
        navigate("/"); // ถ้าไม่มี Token ให้กลับไปหน้า Login
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchOnceBook = async () => {
      try {
        const res = await axios.get(`/show-once-book/${id}`, { withCredentials: true });
        setBook(res.data.book || {});
        console.log(res.data.book);
      } catch (error) {
        console.error("Error fetching once book", error);
      }
    };

    fetchOnceBook();
  }, [id]);

  const addToCart = async (id) => {
    try {
      const res = await axios.post(`/cart/add-to-cart/${id}`, { withCredentials: true });

      if (res.status === 201) {
        toast.success(res.data.message);
        window.dispatchEvent(new Event('cart-updated'));
        navigate("/user/HomePage");
      }

    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        console.error("Error adding to cart", error);
        toast.error("เกิดข้อผิดพลาดในการเพิ่มหนังสือไปยังตะกร้า");
      }
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16 font-sans text-slate-800">
      
      {/* Title Header */}
      <div className="pt-8 px-6 md:px-10 max-w-5xl mx-auto mt-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#2d3695]/10 text-[#2d3695] rounded-2xl">
            <Book className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl text-slate-800">รายละเอียดหนังสือ</h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              ตรวจสอบข้อมูลรายละเอียดสภาพและตัวเลือกจัดส่งของหนังสือเรียน
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            {/* Left: Book Cover Image */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4] bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-6 group">
                <img 
                  className="h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 filter drop-shadow-md" 
                  src={book.bookPic ? `${SERVER_URL}/${book.bookPic.replace(/\\/g, "/")}` : "https://via.placeholder.com/300x400"} 
                  alt={book.titleBook || "ชื่อหนังสือ"} 
                />
              </div>
            </div>

            {/* Right: Book Details & Actions */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Subject Badge */}
                {book.subjectCode && (
                  <span className="inline-flex px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-[#2F5792]/5 text-[#2F5792] border border-[#2F5792]/10 mb-4 tracking-wide">
                    📚 รหัสวิชา: {book.subjectCode}
                  </span>
                )}
                
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight mb-2">
                  {book.titleBook || "ไม่มีชื่อหนังสือ"}
                </h2>

                <div className="divider my-4 before:bg-slate-100 after:bg-slate-100"></div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">รายละเอียดหนังสือ</h4>
                    <p className="text-slate-655 leading-relaxed font-semibold text-xs md:text-sm bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                      {book.description || "ไม่มีรายละเอียดสภาพหนังสือ"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">เงื่อนไขการส่งมอบ</h4>
                    {book.canMeet === "yes" ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                        🤝 สะดวกนัดรับภายในมหาวิทยาลัย
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200/50">
                        📦 จัดส่งพัสดุ (EMS) เท่านั้น
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                {/* Price block */}
                <div className="mt-8 mb-6 pt-5 border-t border-slate-100">
                  <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">ราคาขาย</h4>
                  <div className="text-4xl font-black text-[#2F5792] flex items-baseline gap-1">
                    {book.price}
                    <span className="text-sm font-extrabold text-slate-400">บาท (฿)</span>
                  </div>
                </div>

                {/* Actions Button Grid */}
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => navigate('/user/Chat')}
                      className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-slate-200 text-[#2F5792] hover:bg-slate-50 font-bold text-xs shadow-sm hover:shadow transition-all duration-300 cursor-pointer hover:border-slate-300"
                    >
                      <MessageSquareText className="w-4 h-4" />
                      <span>ส่งข้อความแชท</span>
                    </button>
                    
                    <button 
                      onClick={() => addToCart(book.id)}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-98 transition-all duration-300 cursor-pointer"
                    >
                      <span>เพิ่มใส่ตะกร้า</span>
                    </button>
                  </div>

                  <Link 
                    to={`/user/BuyNowPage/${book.id}`} 
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#D93619] hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-500/10 hover:shadow-red-500/20 active:scale-98 transition-all duration-300 text-center"
                  >
                    ซื้อหนังสือทันที
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default DetailsPage;
