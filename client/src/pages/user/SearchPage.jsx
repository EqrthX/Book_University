import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../util/axios.js';
import Promote from "/src/assets/Promote.png";
import BookCard from '../../features/books/components/BookCard.jsx';

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [studentId, setStudentId] = useState("");
  const [userId, setUserId] = useState(null);
  const [books, setBooks] = useState([]);

  const query = new URLSearchParams(location.search);
  const searchKeyword = query.get("book") || "";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/auth/protected', { withCredentials: true });
        setStudentId(res.data.user.studentId);
        setUserId(res.data.user.id);
      } catch (error) {
        console.error("User not authenticated", error);
        navigate("/"); // ถ้าไม่มี Token ให้กลับไปหน้า Login
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const searchBooks = async () => {
      try {
        const res = await axios.get(`/search-books?book=${searchKeyword}`, { withCredentials: true });
        setBooks(res.data.books || []);
      } catch (error) {
        console.error("Error fetching books", error);
      }
    };

    if (searchKeyword) {
      searchBooks();
    }
  }, [searchKeyword]);

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16 font-sans text-slate-800">

      {/* Hero Search Header Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white h-[220px] flex items-center">
        {/* Background Banner with Opacity Mask */}
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-25"
            src={Promote}
            alt="promotion banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-left w-full">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#E28743] text-white mb-3.5 uppercase tracking-wider">
            🔍 ผลการค้นหาหนังสือเรียน
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            คำค้นหา: <span className="bg-gradient-to-r from-amber-400 to-[#3986DD] bg-clip-text text-transparent">"{searchKeyword}"</span>
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-2 font-semibold">
            มีรายการที่ตรงหรือใกล้เคียงวิชาเรียนทั้งหมด {books.length} รายการ
          </p>
        </div>
      </div>

      {/* Results Workspace */}
      <div className="container mx-auto px-6 md:px-10 mt-10">

        {books.length > 0 ? (
          <div>
            <div className="flex items-center gap-2 mb-8 pb-3 border-b border-slate-200">
              <span className="w-2.5 h-6 bg-[#2F5792] rounded-full inline-block"></span>
              <h2 className="text-lg font-black text-slate-800">หนังสือที่ค้นพบ</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 gap-y-10">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        ) : (
          /* Empty Search Fallback SVG Illustration */
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 max-w-lg mx-auto shadow-sm px-6">
            <svg className="w-20 h-20 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-base font-bold text-slate-700">ไม่พบหนังสือเรียนที่ค้นหา</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto font-semibold leading-relaxed">
              ไม่พบข้อมูลหนังสือเรียนตามรหัสวิชาหรือชื่อหนังสือที่ระบุ ลองตรวจสอบตัวสะกดใหม่อีกครั้ง หรือกลับไปที่หน้าหลักเพื่อเริ่มต้นหาใหม่
            </p>
            <button
              onClick={() => navigate('/user/HomePage')}
              className="mt-6 btn btn-primary btn-sm bg-[#2F5792] text-white border-0 hover:bg-[#1A365D] rounded-xl font-bold px-6 py-2.5 h-auto cursor-pointer"
            >
              กลับหน้าหลัก
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchPage;
