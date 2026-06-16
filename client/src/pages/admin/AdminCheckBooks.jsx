import { useEffect, useState } from 'react';
import axios, { SERVER_URL } from '../../util/axios.js';
import toast from 'react-hot-toast';
import { Book, Check, Trash2, ShieldAlert, BookOpen } from "lucide-react";

const AdminCheckBooks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [detailBook, setDetailBook] = useState({ books: [] });

  const showBooksUnavailable = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/admin/show-books-unavailable', { withCredentials: true });
      if (res.data.books && Array.isArray(res.data.books)) {
        setDetailBook(res.data);
      }
    } catch (error) {
      console.error('Error fetching books unavailable: ', error);
      setErrorMessage('ดึงข้อมูลหนังสือไม่สำเร็จ');
      toast.error('ดึงข้อมูลหนังสือล้มเหลว');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    showBooksUnavailable();
  }, []);

  const handleConfirmBook = async (id) => {
    setIsLoading(true);
    try {
      const res = await axios.put(`/admin/update-status-book/${id}`, { checkStatusBooks: 'available' }, { withCredentials: true });
      if (res.status === 200) {
        toast.success('ยืนยันการวางขายสำเร็จ');
        setDetailBook(prevState => ({
          ...prevState,
          books: prevState.books.filter(book => book.id !== id)
        }));
      }
    } catch (error) {
      console.error('Error confirming book: ', error);
      toast.error('ไม่สามารถยืนยันข้อมูลได้');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBook = async (bookId) => {
    const confirmDelete = window.confirm("ต้องการลบข้อมูลสินค้านี้ใช่ไหม");
    if (!confirmDelete) return;
    
    setIsLoading(true);
    try {
      const res = await axios.delete(`/product/delete-book`, { data: { bookId }, withCredentials: true });
      if (res.status === 200) {
        toast.success("ลบสินค้าเรียบร้อย");
        setDetailBook(prevState => ({
          ...prevState,
          books: prevState.books.filter(book => book.id !== bookId)
        }));
      }
    } catch (error) {
      console.error('Error deleting book', error);
      toast.error("ลบข้อมูลผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-5 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">ตรวจสอบและอนุมัติหนังสือ</h1>
          <p className="text-sm text-slate-500 mt-1">ยืนยันหรือระงับหนังสือใหม่ที่นักศึกษาลงขายในระบบ</p>
        </div>
      </div>

      {/* Grid container */}
      {isLoading && detailBook.books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="loading loading-spinner loading-lg text-blue-600"></span>
          <span className="text-sm text-slate-400 font-semibold mt-4">กำลังโหลดข้อมูล...</span>
        </div>
      ) : errorMessage ? (
        <div className="flex flex-col items-center justify-center py-20 text-red-500 bg-red-50/50 border border-red-100 rounded-2xl">
          <ShieldAlert className="w-12 h-12 mb-2" />
          <p className="font-bold">{errorMessage}</p>
        </div>
      ) : detailBook.books && detailBook.books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {detailBook.books.map((book) => {
            const coverImage = book.bookPic 
              ? `${SERVER_URL}/${book.bookPic.replace(/\\/g, "/")}` 
              : "https://via.placeholder.com/150";

            return (
              <div 
                key={book.id} 
                className="bg-white border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-4 flex flex-col justify-between hover:-translate-y-0.5"
              >
                {/* Book Cover */}
                <div>
                  <div className="relative aspect-[3/4] bg-slate-50 border border-slate-100 rounded-xl overflow-hidden p-3 flex justify-center items-center">
                    <img
                      className="h-full object-contain shadow-sm"
                      src={coverImage}
                      alt={book.titleBook || "Book"}
                    />
                    <span className="absolute top-3 right-3 text-[10px] uppercase font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                      รอยืนยัน
                    </span>
                  </div>

                  {/* Meta Details */}
                  <div className="mt-4 space-y-1">
                    <h3 className="font-extrabold text-sm text-slate-800 line-clamp-1 leading-snug">{book.titleBook}</h3>
                    <p className="text-xs text-slate-400">ราคาลงขาย: <span className="font-bold text-blue-600">{book.price} ฿</span></p>
                    {book.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100/50">
                        {book.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Confirm/Reject Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                  <button
                    className="flex-1 flex items-center justify-center space-x-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-emerald-500/10"
                    onClick={() => handleConfirmBook(book.id)}
                    disabled={isLoading}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>อนุมัติ</span>
                  </button>

                  <button 
                    onClick={() => deleteBook(book.id)} 
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center space-x-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl text-xs font-bold transition-all active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ปฏิเสธ (ลบ)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-2xl">
          <BookOpen className="w-12 h-12 text-slate-300 mb-3 animate-pulse" />
          <p className="text-slate-500 font-medium">ไม่มีหนังสือรอยืนยันในขณะนี้</p>
        </div>
      )}

    </div>
  );
};

export default AdminCheckBooks;