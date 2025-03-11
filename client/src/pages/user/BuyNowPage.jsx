import Head from './components/Head'
import Navdar from './components/Navdar'
import { ShoppingCart } from 'lucide-react'
import Book1 from "/src/assets/Book1.jpg"; // รูปหนังสือ
import { Link } from 'react-router-dom';

function BuyNowPage() {
  return (
    <div className='bg-[#F5F5F5] min-h-screen pb-10 '>
        <Head/>
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
                            <img className="w-70 h-100 object-cover rounded-2xl " src={Book1} alt="หนังสือ" />

                            {/* กล่องรายละเอียดหนังสือ */}
                            <div className="flex-1 space-y-2 ml-5">
                                <p className="font-bold text-lg mt-20">ชื่อหนังสือ</p>

                                <div className="flex items-start mt-5">
                                    <span className="font-bold">รายละเอียด :</span>
                                    <p className="text-sm text-gray-700 ml-2 break-words max-w-xs"></p>
                                </div>

                                <div className="flex items-center mt-5">
                                    <span className="font-bold">ราคา :</span>
                                    <p className="text-sm text-gray-700 ml-2">XXX บาท</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ปุ่มชำระเงินอยู่ตรงกลาง */}
                    <div className="col-span-2 flex items-center justify-center">
                        <div className="bg-[#F8E94C] text-black px-6 py-2 mb-85 text-center ">
                            นัดรับได้
                        </div>
                    </div>

                    {/* สรุปรายการสั่งซื้อ อยู่ด้านขวา */}
                    <div className="col-span-4 bg-gray-100 p-4 border flex flex-col h-full">
                        <h2 className="text-lg font-bold mb-4 text-center">สรุปรายการสั่งซื้อ</h2>
                        <p className="w-full h-[1px] bg-black" />
                        <div className="text-gray-700 space-y-2 mt-5">
                            <div className="grid grid-cols-3 gap-4">
                                <p className="text-right pr-10">จำนวน</p>
                                <p className="text-right font-bold rtl">1</p>
                                <p className="text-left pl-12">ชิ้น</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <p className="text-right pr-7">ราคารวม</p>
                                <p className="text-right font-bold rtl"></p>
                                <p className="text-left pl-12">บาท</p>
                            </div>
                        </div>
                        <div className="text-gray-700 space-y-2 mt-auto">
                            <p className="w-full h-[1px] border-t border-dashed border-black" />
                            <div className="grid grid-cols-3 gap-4">
                                <p className="text-lg font-bold text-center">ราคารวมสุทธิ</p>
                                <p className="text-right font-bold rtl"></p>
                                <p className="text-left pl-12">บาท</p>
                            </div>
                        </div>
                        <div className="mt-5">
                          
                        <Link to = '/user/DeliveryPage'><button className="w-full bg-[#3D6299] text-white py-2 font-bold hover:bg-[#1e256f]">
                                ดำเนินการชำระเงิน
                            </button></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BuyNowPage;
