import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../util/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Promote from "../../assets/Promote.png";
import BookCard from "../../features/books/components/BookCard.jsx";

const HomePage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all"); // "all" | "meet" | "ship"
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    const getAllBooks = async () => {
      try {
        const res = await axios.get('/product/show-books', { withCredentials: true });
        setBooks(res.data.books || []);
      } catch (error) {
        console.error("Error fetching books", error);
      }
    };

    getAllBooks();
  }, []);

  // Filter books dynamically based on active categories and search tags
  const filteredBooks = books.filter(book => {
    const matchesCategory = 
      selectedCategory === "all" ||
      (selectedCategory === "meet" && book.canMeet === "yes") ||
      (selectedCategory === "ship" && book.canMeet !== "yes");

    const matchesSubject = 
      !selectedSubject || 
      book.subjectCode === selectedSubject;

    return matchesCategory && matchesSubject;
  });

  return (
    <div className="pb-16 bg-[#F5F5F5] min-h-screen">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white h-[350px] md:h-[420px] flex items-center">
        {/* Background Banner with Opacity Mask */}
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover opacity-35" 
            src={Promote} 
            alt="promotion banner" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 w-full">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold bg-[#E28743] text-white mb-4 uppercase tracking-wider shadow-sm animate-pulse">
              🔥 แหล่งส่งต่อหนังสือเรียน UTCC
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              ตลาดซื้อขายหนังสือเรียน <br />
              <span className="bg-gradient-to-r from-amber-400 to-[#3986DD] bg-clip-text text-transparent">
                เพื่อน้องพี่ชาว UTCC
              </span>
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mb-6 leading-relaxed max-w-lg">
              ส่งต่อความรู้ แลกเปลี่ยนหนังสือเรียน และชีทสรุปราคาประหยัดสำหรับนักศึกษาทุกคน 
              สะดวก รวดเร็ว ทั้งบริการจัดส่งพัสดุและทางเลือกนัดรับใต้ตึกเรียน
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a href="#marketplace" className="btn btn-primary bg-[#2F5792] border-0 text-white hover:bg-[#1A365D] rounded-xl px-6 font-bold text-xs h-auto min-h-0 py-3 shadow-md">
                เริ่มสำรวจหนังสือ
              </a>
              <Link to="/user/AddBook" className="btn btn-outline border-white text-white hover:bg-white hover:text-slate-900 rounded-xl px-6 font-bold text-xs h-auto min-h-0 py-3">
                ลงขายหนังสือ
              </Link>
            </div>
          </div>

          {/* Decorative Floating SVG Illustration */}
          <div className="hidden lg:block w-64 h-64 relative">
            <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-2xl animate-bounce-subtle">
              <defs>
                <linearGradient id="svgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3986DD" />
                  <stop offset="100%" stopColor="#2F5792" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="url(#svgGrad)" opacity="0.15" />
              <path d="M50 130 L150 130 L130 165 L70 165 Z" fill="#2B6CB0" opacity="0.8" />
              <rect x="60" y="80" width="80" height="50" rx="4" fill="#3182CE" />
              <rect x="70" y="90" width="60" height="6" rx="2" fill="#E2E8F0" />
              <rect x="70" y="104" width="45" height="6" rx="2" fill="#E2E8F0" />
              <path d="M100 50 L130 65 L100 80 L70 65 Z" fill="#E28743" />
              <line x1="100" y1="80" x2="100" y2="105" stroke="#E28743" strokeWidth="3" />
              <path d="M120 65 L120 100" stroke="#CBD5E0" strokeWidth="2" strokeDasharray="3 3" />
            </svg>
          </div>
        </div>

        {/* Curved Wave SVG divider at bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg className="relative block w-full h-8 text-[#F5F5F5]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,87.43,26.54,171.74,49.44,258.1,68.18,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      {/* Marketplace Stats / Values */}
      <div className="container mx-auto px-4 md:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Books In Store */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 transition-all hover:translate-y-[-4px] hover:shadow-md">
            <div className="p-3 bg-blue-50 rounded-xl">
              <svg className="w-6 h-6 text-[#2F5792]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-black text-slate-800">{books.length}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">เล่มในคลังทั้งหมด</p>
            </div>
          </div>

          {/* Card 2: Hand-Deliver option */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 transition-all hover:translate-y-[-4px] hover:shadow-md">
            <div className="p-3 bg-amber-50 rounded-xl">
              <svg className="w-6 h-6 text-[#E28743]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-black text-slate-800">
                {books.filter(b => b.canMeet === "yes").length}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">รายการนัดรับกับผู้ขาย</p>
            </div>
          </div>

          {/* Card 3: Trust & Safety */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 transition-all hover:translate-y-[-4px] hover:shadow-md">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-black text-slate-800">100%</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">เฉพาะสมาชิก UTCC เท่านั้น</p>
            </div>
          </div>

        </div>
      </div>

      {/* Marketplace Section */}
      <div id="marketplace" className="container mx-auto px-4 md:px-8 mt-14 scroll-mt-24">
        
        {/* Marketplace Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-[#2F5792] rounded-full inline-block"></span>
              หนังสือเรียนทั้งหมด
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">
              ค้นหาตามความต้องการ เลือกนัดรับได้ทันที หรือจัดส่งสะดวกสบาย
            </p>
          </div>

          {/* Quick Clear Filter status */}
          {(selectedCategory !== "all" || selectedSubject) && (
            <button 
              onClick={() => { setSelectedCategory("all"); setSelectedSubject(""); }}
              className="text-xs font-bold text-[#D93619] hover:underline mt-2 md:mt-0 flex items-center gap-1 cursor-pointer"
            >
              <span>✕ ล้างตัวกรองทั้งหมด</span>
            </button>
          )}
        </div>

        {/* Interactive Filter Category Tabs */}
        <div className="flex flex-wrap justify-start items-center gap-2 mb-8 bg-slate-200/60 p-1 rounded-2xl w-fit">
          <button 
            onClick={() => { setSelectedCategory("all"); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#2F5792] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            📚 ทั้งหมด
          </button>
          <button 
            onClick={() => { setSelectedCategory("meet"); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer ${
              selectedCategory === "meet"
                ? "bg-[#2F5792] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            🤝 นัดรับสินค้าได้
          </button>
          <button 
            onClick={() => { setSelectedCategory("ship"); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer ${
              selectedCategory === "ship"
                ? "bg-[#2F5792] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            📦 จัดส่งพัสดุ
          </button>
        </div>

        {/* Dynamic Subject Recommendation Chips */}
        {books.length > 0 && (
          <div className="mb-10 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3.5">
              🔍 ค้นหาด่วนตามวิชายอดนิยม:
            </p>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedSubject("")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  !selectedSubject 
                    ? "bg-[#2F5792]/10 text-[#2F5792] border-[#2F5792]" 
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
                }`}
              >
                ทั้งหมด
              </button>
              {Array.from(new Set(books.map(b => b.subjectCode).filter(Boolean)))
                .slice(0, 12)
                .map((subj) => (
                  <button 
                    key={subj}
                    onClick={() => setSelectedSubject(subj)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      selectedSubject === subj 
                        ? "bg-[#2F5792]/10 text-[#2F5792] border-[#2F5792] shadow-sm" 
                        : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {subj}
                  </button>
                ))
              }
            </div>
          </div>
        )}

        {/* Books Grid display */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 gap-y-10">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          /* Empty Search Fallback SVG Illustration */
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 max-w-lg mx-auto shadow-sm px-6">
            <svg className="w-20 h-20 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-base font-bold text-slate-700">ไม่พบหนังสือเรียนที่ระบุ</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto font-medium">
              ลองเปลี่ยนหมวดหมู่ตัวเลือก ตัวกรองวิชา หรือกดล้างตัวกรองทั้งหมดเพื่อเริ่มต้นเลือกซื้อใหม่อีกครั้ง
            </p>
            <button 
              onClick={() => { setSelectedCategory("all"); setSelectedSubject(""); }}
              className="mt-5 btn btn-primary btn-sm bg-[#2F5792] text-white border-0 hover:bg-[#1A365D] rounded-xl font-bold px-6 py-2.5 h-auto cursor-pointer"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default HomePage;
