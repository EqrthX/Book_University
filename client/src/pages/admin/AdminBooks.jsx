import { useEffect, useState } from 'react';
import axios from '../../util/axios.js';
import toast from 'react-hot-toast';
import { BookOpen, User, Book, Trash2, Calendar, AlertTriangle, ShieldCheck, ShoppingCart } from 'lucide-react';
import { getImageUrl } from '../../util/image.js';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/admin/books', { withCredentials: true });
      setBooks(res.data.books || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('ไม่สามารถดึงข้อมูลรายการหนังสือได้', { id: 'fetch-books-error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleStatusToggle = async (bookId, field, currentValue) => {
    let newValue;
    if (field === 'checkStatusBooks') {
      newValue = currentValue === 'available' ? 'unavailable' : 'available';
    } else if (field === 'status') {
      newValue = currentValue === 'available' ? 'sold' : 'available';
    }

    try {
      const updateData = {};
      updateData[field] = newValue;

      await axios.put(`/admin/books/${bookId}/admin-status`, updateData, { withCredentials: true });
      toast.success('อัปเดตสถานะหนังสือเรียบร้อยแล้ว');
      
      // Update local state
      setBooks(prev => prev.map(b => {
        if (b.id === bookId) {
          const updated = { ...b };
          updated[field] = newValue;
          return updated;
        }
        return b;
      }));
    } catch (error) {
      console.error('Update status error:', error);
      toast.error('ไม่สามารถอัปเดตสถานะได้');
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`/admin/books/${bookId}`, { withCredentials: true });
      toast.success('ลบหนังสือออกจากระบบสำเร็จ');
      setBooks(prev => prev.filter(b => b.id !== bookId));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Delete book error:', error);
      toast.error('ไม่สามารถลบหนังสือได้');
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full text-slate-800">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1E3B] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            การจัดการและติดตามสถานะหนังสือ
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            ติดตามตรวจสอบหนังสือเรียนทั้งหมดในระบบ การอนุมัติเปิดวางขาย และสถานะสินค้าคงคลัง
          </p>
        </div>
        <button 
          onClick={fetchBooks}
          className="btn btn-outline border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-bold text-xs rounded-xl px-4 flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          รีเฟรชข้อมูล
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <span className="loading loading-spinner loading-lg text-blue-600"></span>
          <span className="text-sm text-slate-400 font-semibold mt-4">กำลังโหลดรายชื่อหนังสือ...</span>
        </div>
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-300">
          <Book className="w-16 h-16 mb-2" />
          <span className="text-sm font-semibold">ยังไม่มีหนังสือเรียนถูกเพิ่มในระบบ</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-slate-100 rounded-2xl shadow-sm">
          <table className="table table-zebra w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-extrabold text-xs uppercase border-b border-slate-100">
                <th className="py-4 pl-6">หนังสือ</th>
                <th className="py-4">รหัสวิชา</th>
                <th className="py-4">เจ้าของ</th>
                <th className="py-4">ราคา (บาท)</th>
                <th className="py-4">สถานะการอนุมัติ</th>
                <th className="py-4">สถานะจำหน่าย</th>
                <th className="py-4 pr-6 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {books.map((bookItem) => (
                <tr key={bookItem.id} className="hover:bg-slate-50/50 border-b border-slate-100 transition-colors">
                  {/* Book details with thumbnail */}
                  <td className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0 flex items-center justify-center">
                        <img 
                          src={getImageUrl(bookItem.bookPic)} 
                          alt="Cover" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150';
                          }}
                        />
                      </div>
                      <div className="max-w-[200px] md:max-w-xs">
                        <p className="font-extrabold text-slate-800 text-sm truncate">{bookItem.titleBook}</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">
                          ลงขายเมื่อ: {formatDate(bookItem.createdAt)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Subject Code */}
                  <td className="py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
                      {bookItem.subject?.subjectCode || '-'}
                    </span>
                  </td>

                  {/* Owner Student */}
                  <td className="py-4">
                    <div>
                      <p className="font-bold text-slate-700 text-xs">{bookItem.user?.fullName || 'ไม่มีข้อมูล'}</p>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">ID: {bookItem.user?.studentId || '-'}</p>
                    </div>
                  </td>

                  {/* Book Price */}
                  <td className="py-4">
                    <span className="font-extrabold text-blue-600 text-sm">
                      {bookItem.price?.toLocaleString()}
                    </span>
                  </td>

                  {/* Approval Status Toggle */}
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusToggle(bookItem.id, 'checkStatusBooks', bookItem.checkStatusBooks)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                          bookItem.checkStatusBooks === 'available'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {bookItem.checkStatusBooks === 'available' ? 'อนุมัติแล้ว' : 'รอการตรวจสอบ'}
                      </button>
                    </div>
                  </td>

                  {/* Listing Sales Status */}
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusToggle(bookItem.id, 'status', bookItem.status)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                          bookItem.status === 'available'
                            ? 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {bookItem.status === 'available' ? 'กำลังลงขาย' : 'ขายแล้ว'}
                      </button>
                    </div>
                  </td>

                  {/* Action buttons */}
                  <td className="py-4 pr-6 text-center">
                    <button 
                      onClick={() => setDeleteConfirmId(bookItem.id)}
                      className="btn btn-ghost btn-xs text-rose-500 hover:bg-rose-50 rounded-lg hover:text-rose-600 transition-colors p-1"
                      title="ลบหนังสือออกจากระบบ"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200 text-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">ลบหนังสือออกจากระบบ</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">ยืนยันต้องการลบอย่างถาวรใช่หรือไม่?</p>
              </div>
            </div>
            <p className="text-slate-500 font-semibold text-xs leading-relaxed mb-6">
              การกระทำนี้จะลบหนังสือเล่มนี้ออกจากระบบทันที ผู้ใช้ทั่วไปจะไม่สามารถสั่งซื้อหรือเข้าดูรายละเอียดของหนังสือเล่มนี้ได้อีก
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs transition-all duration-200 cursor-pointer text-center text-slate-600"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => handleDeleteBook(deleteConfirmId)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-md shadow-red-500/10 hover:shadow-red-500/20 hover:scale-[1.01] transition-all duration-200 cursor-pointer text-center"
              >
                ลบหนังสือ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBooks;
