import { ShoppingCart } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../../util/axios.js';
import { getImageUrl } from '../../util/image.js';

function BuyNowPage() {

    const navigate = useNavigate();
    const {id} = useParams();
    const [book, setBook] = useState([]);
    const [user, setUser] = useState({
        userId: "",
        studentId: "",
    });
    
    useEffect(() => {

        const checkAuthAndFetechOneBook = async () => {

            try {

                const res = await axios.get('/auth/protected', {withCredentials: true});

                setUser({
                    userId: res.data.user.userId,
                    studentId: res.data.user.studentId,
                })
                
                const bookRes = await axios.get(`/show-once-book/${id}`, {withCredentials: true});
                setBook(bookRes.data.book);
                console.log("Book Response:", bookRes.data.book);


            } catch (error) {
                console.error("User not authenticated", error)
                navigate('/')
            }
        }

        checkAuthAndFetechOneBook();

    }, [navigate, user.userId])

  return (
    <div className='bg-[#F5F5F5] min-h-screen pb-16 font-sans text-slate-800'>
                
        <div className='container mx-auto px-4 md:px-8 pt-8 max-w-6xl'>
            {/* Header */}
            <div className="flex items-center mb-6">
                <ShoppingCart className="w-8 h-8 text-[#2d3695]" />
                <h1 className="font-extrabold text-2xl ml-3 text-slate-800">สรุปการสั่งซื้อสินค้า</h1>
            </div>

            {/* Content Box */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Book Detail section */}
                    <div className="lg:col-span-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                            {/* Book cover image */}
                            <img className="w-44 h-60 object-cover rounded-2xl border border-slate-100 shadow-sm flex-shrink-0" 
                                src={book.bookPic ? getImageUrl(book.bookPic) : "https://via.placeholder.com/300x400"} 
                                alt={book.titleBook || "หนังสือ"} />

                            {/* Book details */}
                            <div className="flex-1 space-y-3">
                                {book.canMeet === "yes" ? (
                                    <span className="inline-flex px-3.5 py-1.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-xl border border-amber-200">
                                        🤝 สะดวกนัดรับได้
                                    </span>
                                ) : (
                                    <span className="inline-flex px-3.5 py-1.5 bg-rose-100 text-rose-800 text-xs font-bold rounded-xl border border-rose-200">
                                        📦 จัดส่งพัสดุเท่านั้น
                                    </span>
                                )}
                                
                                <h3 className="font-extrabold text-xl md:text-2xl text-slate-800">{book.titleBook}</h3>

                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                                    <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                                        <span className="font-extrabold text-slate-900">รายละเอียด:</span> {book.description || "ไม่มีรายละเอียดสภาพเพิ่มเติม"}
                                    </p>
                                    <p className="text-base font-black text-[#2F5792] pt-1">
                                        ราคาต่อเล่ม: {book.price} ฿
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Summary section */}
                    <div className="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between h-full">
                        <div>
                            <h2 className="text-lg font-black mb-4 text-slate-800 border-b border-slate-200 pb-3">สรุปรายการสั่งซื้อ</h2>
                            
                            <div className="space-y-3 text-slate-600 font-semibold text-base py-2">
                                <div className="flex justify-between">
                                    <span>จำนวนสินค้า</span>
                                    <span className="font-extrabold text-slate-900">{book.quantity || 1} ชิ้น</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>ราคารวม</span>
                                    <span className="font-extrabold text-slate-900">{book.price * (book.quantity || 1)} ฿</span>
                                </div>
                            </div>

                            <div className="border-t border-dashed border-slate-300 pt-4 mt-4 flex justify-between items-center">
                                <span className="text-base font-extrabold text-slate-900">ราคารวมสุทธิ</span>
                                <span className="text-2xl font-black text-[#2F5792]">{book.price * (book.quantity || 1)} ฿</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <Link 
                                to='/user/DeliveryPage'
                                state={{ 
                                    price: book.price,
                                    bookId: book.id,
                                    quantity: book.quantity || 1
                                }}
                            >
                                <button className="w-full bg-[#2F5792] hover:bg-[#1A365D] text-white py-3.5 px-4 font-extrabold text-base rounded-xl shadow-md shadow-blue-500/10 transition-all cursor-pointer">
                                    ดำเนินการชำระเงิน
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BuyNowPage;
