import { useEffect, useState } from 'react';
import axios from '../../util/axios.js';
import toast from 'react-hot-toast';

const AdminCheckBooks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [detailBook, setDetailBook] = useState({ books: [] });
  const [checkStatusBooks, setcheckStatusBooks] = useState('');
  const [books, setBooks] = useState([]);


  useEffect(() => {
    const showBooksUnavailable = async () => {
      setIsLoading(true);

      try {
        const res = await axios.get('/admin/show-books-unavailable', { withCredentials: true });
        console.log("API Response:", res.data);

        if (res.data.books && Array.isArray(res.data.books)) {
          setDetailBook(res.data);
          setcheckStatusBooks(res.data.books.map(book => book.checkStatusBooks).join(", "));
        }

      } catch (error) {
        console.error('Error fetching books unavailable: ', error);
        setErrorMessage('Error fetching books unavailable');
        toast.error('Error fetching books unavailable');
      } finally {
        setIsLoading(false);
      }
    };

    showBooksUnavailable();
  }, []);

  const handleConfirmBook = async (id) => {
    setIsLoading(true);

    try {
      const res = await axios.put(`/admin/update-status-book/${id}`, { checkStatusBooks: 'available' }, { withCredentials: true });

      if (res.status === 200) {
        toast.success('ยืนยันการลงขายหนังสือ');

        // อัปเดตสถานะของหนังสือใน state โดยใช้ map()
        setDetailBook(prevState => ({
          ...prevState,
          books: prevState.books.map(book =>
            book.id === id ? { ...book, checkStatusBooks: 'available' } : book
          )
        }));
      }

    } catch (error) {
      console.error('Error confirming book: ', error);
      setErrorMessage('Error confirming book');
    } finally {
      setIsLoading(false);
    }
  };
  // กดยกเลิก แล้วลบหนังสือ
  const deleteBook = async (bookId) => {
    const confirmDelete = window.confirm("ต้องการลบข้อมูลสินค้านี้ใช่ไหม");
    if (!confirmDelete) return;
    try {
      const res = await axios.delete(`/product/delete-book`, { data: { bookId }, withCredentials: true });
      if (res.status === 200) {
        toast.success("ลบสินค้าสำเร็จ");
        setBooks(books.filter(book => book.id !== bookId));
      }
    } catch (error) {
      console.error('Error deleting book', error);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <h3 className="font-semibold text-3xl mb-6 mt-6">ตรวจสอบหนังสือ</h3>

      {/* แสดงรายการยืนยันหนังสือ */}
      <div className="relative mx-auto grid grid-cols-4 gap-10 w-full max-h-screen justify-center">
        
        {isLoading ? (

          <p className="text-amber-600 font-semibold animate-bounce">Loading...</p>

        ) : errorMessage ? (

          <p className="text-red-500 font-semibold">{errorMessage}</p>

        ) : detailBook.books && detailBook.books.length > 0 ? (

          detailBook.books.map((book, index) => (
            
            <div key={index} className="flex flex-col w-60">
              
              <img
                className="border-4 p-2 w-full rounded-2xl"
                src={book.bookPic ? `http://localhost:5001/${book.bookPic.replace(/\\/g, "/")}` : "URL_TO_DEFAULT_IMAGE"}
                alt={book.titleBook || "No Title"}
              />

              <p className="mt-1 font-semibold">ชื่อหนังสือ: {book.titleBook}</p>
              <p className="mt-1 font-semibold text-amber-500">สถานะการวางขาย: {book.checkStatusBooks}</p>

              <button
                className="p-2 bg-[#358C1B] rounded-xl mb-5 transition-all hover:bg-[#43633a] text-white "
                onClick={() => handleConfirmBook(book.id)}
              >
                ยืนยัน
              </button>

              {/* เพิ่มชังฟันลบแล้ว */}
              <button onClick={() => deleteBook(book.id)} className="p-2 bg-[#D93619] rounded-xl mb-5 transition-all hover:bg-red-700 text-white">
                ยกเลิก
              </button>

            </div>
          ))
        ) : (
          <p className='text-xl animate-bounce text-fuchsia-800'>ไม่มีหนังสือที่ยังไม่ได้ยืนยัน</p>
        )}

      </div>
    </div>
  );
};

export default AdminCheckBooks;