import Head from './components/Head'
import Navdar from './components/Navdar'
import { ShoppingCart } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../../util/axios.js';

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
    <div className='bg-[#F5F5F5] min-h-screen pb-10 '>
        <Head studentId={user.studentId}/>
        <Navdar/>

        <div className='pt-35 px-6 md:px-30 '>
            {/* icon กับ ข้อความ */}
            <div className="flex items-center mb-6">
                <ShoppingCart className="w-10 h-10 text-[#2d3695]" />
                <h1 className="font-bold text-2xl ml-3">รายการสินค้า</h1>
            </div>

            {/* กรอบสีขาว */}
            <div className="bg-white p-10 rounded-l-3xl shadow w-full ">
                <div className="grid grid-cols-10 gap-6">

                    {/* ส่วนรายละเอียดหนังสือ */}
                    <div className="col-span-4">
                        <div className="flex items-start space-x-4">

                            {/* รูปหนังสือ */}
                            <img className="w-70 h-100 object-cover rounded-2xl " 
                                src={book.bookPic ? `http://localhost:5001/${book.bookPic.replace(/\\/g, "/")}` : "URL_TO_DEFAULT_IMAGE"} 
                                alt="หนังสือ" />

                            {/* กล่องรายละเอียดหนังสือ */}
                            <div className="flex-1 space-y-2 ml-5">
                                <p className="font-bold text-lg mt-20">{book.titleBook} </p>

                                <div className="flex items-start mt-5">
                                    <span className="font-bold">รายละเอียด : {book.description}</span>
                                    <p className="text-sm text-gray-700 ml-2 break-words max-w-xs"></p>
                                </div>

                                <div className="flex items-center mt-5">
                                    <span className="font-bold">ราคา :</span>
                                    <p className="text-sm text-gray-700 ml-2">{book.price} บาท</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ปุ่มชำระเงินอยู่ตรงกลาง */}
                    <div className="col-span-2 flex items-center justify-center">
                        {book.canMeet === "yes" ? (
                            <div className="bg-[#F8E94C] text-white px-6 py-2 mb-85 text-center ">
                                นัดรับได้
                            </div>
                        ) : (
                            <div className="bg-[#D93619] text-white px-6 py-2 mb-85 text-center ">
                                นัดรับไม่ได้
                            </div>
                        )}
                    </div>

                    {/* สรุปรายการสั่งซื้อ อยู่ด้านขวา */}
                    <div className="col-span-4 bg-gray-100 p-4 border flex flex-col h-full">
                        <h2 className="text-lg font-bold mb-4 text-center">สรุปรายการสั่งซื้อ</h2>
                        <p className="w-full h-[1px] bg-black" />
                        <div className="text-gray-700 space-y-2 mt-5">
                            <div className="grid grid-cols-3 gap-4">
                                <p className="text-right pr-10">จำนวน</p>
                                <p className="text-right font-bold rtl">{book.quantity}</p>
                                <p className="text-left pl-12">ชิ้น</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <p className="text-right pr-7">ราคารวม</p>
                                <p className="text-right font-bold rtl">{book.price * book.quantity}</p>
                                <p className="text-left pl-12">บาท</p>
                            </div>
                        </div>
                        <div className="text-gray-700 space-y-2 mt-auto">
                            <p className="w-full h-[1px] border-t border-dashed border-black" />
                            <div className="grid grid-cols-3 gap-4">
                                <p className="text-lg font-bold text-center">ราคารวมสุทธิ</p>
                                <p className="text-right font-bold rtl">{book.price * book.quantity}</p>
                                <p className="text-left pl-12">บาท</p>
                            </div>
                        </div>
                        <div className="mt-5">
                          
                        <Link 
                            to = '/user/DeliveryPage'
                            state= {{ 
                                price: book.price,
                                bookId: book.id,
                                quantity: book.quantity
                            }}
                        >
                            <button className="w-full bg-[#3D6299] text-white py-2 font-bold hover:bg-[#1e256f]">
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
