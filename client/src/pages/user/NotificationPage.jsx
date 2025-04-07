import React from 'react';
import Head from "./components/Head.jsx";
import Navbar from "./components/Navdar.jsx";
import { Link } from 'react-router-dom';
import { Bell, X, Check, ShoppingCart  } from 'lucide-react';

function NotificationPage() {
  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <Head />
      <Navbar />

      <div className="pt-16 px-6 md:px-20 mt-20">
        <div className="flex items-center mb-6 ml-10">
          <Bell className="w-10 h-10 text-[#2d3695]" />
          <h1 className="font-bold text-2xl ml-3">แจ้งเตือน</h1>
        </div>

        {/* กล่องแจ้งเตือนทั้งหมด */}
        <div className="flex flex-col space-y-6">

        {/* เเจ้งเตือนฝั่งผู้ขาย */}

          {/* ผู้ขายไม่ได้รับการอนุมัติ */}
          <div className="w-full bg-white p-6 shadow-md">
            <div className="flex items-center space-x-4 ml-10">
              <div className="w-15 h-15 bg-[#9F0505] rounded-full flex items-center justify-center">
                <X className="text-white w-11 h-11" />
              </div>
              <div>
                <p className="font-bold ml-5">
                  หนังสือของคุณไม่ได้รับการอนุมัติ กรุณาลงขายใหม่อีกครั้ง
                </p>
                <p className="ml-10">
                  เจ้าหน้าที่ไม่อนุมัติการลงขายหนังสือของคุณ แต่คุณสามารถลงขายหนังสือใหม่ได้ที่ <Link to="/user/AddBook"><u> ต้องการขาย </u></Link>
                </p>
              </div>
            </div>
          </div>

          {/* ได้รับการอนุมัติ */}
          <div className="w-full bg-white p-6 shadow-md">
            <div className="flex items-center space-x-4 ml-10">
              <div className="w-15 h-15 bg-[#358C1B] rounded-full flex items-center justify-center">
                <Check className="text-white w-11 h-11" />
              </div>
              <div>
                <p className="font-bold ml-5">หนังสือของคุณได้รับการอนุมัติเรียบร้อยแล้ว</p>
                <p className="ml-10">
                  เจ้าหน้าที่ได้อนุมัติของตุณลงในระบบเรียบร้อยแล้ว สามารถตรวจสอบได้ที่ <Link to ="/user/SellHistoryPage"><u> ประวัติการขาย </u></Link>
                </p>
              </div>
            </div>
          </div>

          {/* มีคำสั่งซื้อใหม่ */}
          <div className="w-full bg-white p-6 shadow-md">
            <div className="flex items-center space-x-4 ml-10">
              <div className="w-15 h-15 bg-[#2E3191] rounded-full flex items-center justify-center">
                <ShoppingCart className="text-white w-11 h-11" />
              </div>
              <div>
                <p className="font-bold ml-5">คุณมีคำสั่งซื้อใหม่</p>
                <p className="ml-10">
                  คุณได้รับคำสั่งซื้อ ตรวจสอบได้ที่ รายการคำสั่งซื้อ เพื่อตรวจสอบรายละเอียด
                </p>
              </div>
            </div>
          </div>

        {/* แจ้งเตือนฝั่งผู้ซื้อ */}

         <h1 className="font-bold text-4xl"> แจ้งเตือนผู้ซื้อ (เอาออกได้ไม่ได้ใช้)</h1>  {/* ลบได้เลยไม่ได้ใช้ */}

          {/* สั่งซื้อสำเร็จ รอการตรวจสอบ */}
          <div className="w-full bg-white p-6 shadow-md">
            <div className="flex items-center space-x-4 ml-10">
              <div className="w-15 h-15 bg-[#358C1B] rounded-full flex items-center justify-center">
                <Check className="text-white w-11 h-11" />
              </div>
              <div>
                <p className="font-bold ml-5">สั่งซื้อสำเร็จ รอการตรวจสอบ</p>
                <p className="ml-10">
                เจ้าหน้าที่ได้รับคำสั่งซื้อของคุณแล้ว กรุณารอการตรวจสอบการชำระเงิน สามารถดูประวัติคำสั่งซื้อได้ที่ <Link to ="/user/BuyHistoryPage"><u> ประวัติการซื้อ </u></Link>
                </p>
              </div>
            </div>
          </div>

          {/* การชำระเงินได้รับการอนุมัติแล้ว */}
          <div className="w-full bg-white p-6 shadow-md">
            <div className="flex items-center space-x-4 ml-10">
            <div className="w-15 h-15 bg-[#358C1B] rounded-full flex items-center justify-center">
                <Check className="text-white w-11 h-11" />
              </div>
              <div>
                <p className="font-bold ml-5">การชำระเงินได้รับการอนุมัติแล้ว</p>
                <p className="ml-10">
                เจ้าหน้าที่ได้ทำการอนุมัติการชำระเงินของคุณแล้ว 
                คุณสามารถติดตามการเคลื่อนไหวสินค้าได้ที่ <Link to ="/user/BuyHistoryPage"><u> ประวัติการซื้อ</u></Link> หรือ 
                สามารถติดต่อกับผู้ขายได้ที่ <Link to=""><u>แชทพูดคุย </u></Link> 
                </p>
              </div>
            </div>
          </div>

          {/* การชำระเงินของคุณไม่ได้ีัรับการอนุมัติ */}
          <div className="w-full bg-white p-6 shadow-md">
            <div className="flex items-center space-x-4 ml-10">
              <div className="w-15 h-15 bg-[#9F0505] rounded-full flex items-center justify-center">
                <X className="text-white w-11 h-11" />
              </div>
              <div>
                <p className="font-bold ml-5">การชำระเงินได้รับการอนุมัติแล้ว</p>
                <p className="ml-10"> เจ้าหน้าที่ไม่อนุมัติการชำระเงินของคุณ กรุณาติดต่อเจ้าหน้าที่ เพื่อทำการตรวจสอบเพิ่มเติม </p>
              </div>
            </div>
          </div>

                {/* การชำระเงินของคุณมีปัญหา กรุณาติดต่อเจ้าหน้าที่ */}
            <div className="w-full bg-white p-6 shadow-md">
                <div className="flex items-center space-x-4 ml-10">
                    <div className="w-15 h-15 bg-[#ffea00] rounded-full flex items-center justify-center">
                    <span className="text-black text-5xl font-bold">!</span>
                    </div>
                    <div>
                    <p className="font-bold ml-5">การชำระเงินของคุณมีปัญหา กรุณาติดต่อเจ้าหน้าที่</p>
                    <p className="ml-10">เจ้าหน้าที่พบปัญหาการชำระเงินของคุณ กรุณาติดต่อเจ้าหน้าที่ เพื่อทำการตรวจสอบเพิ่มเติม</p>
                    </div>
                </div>
            </div>


            {/* การชำระเงินได้รับการอนุมัติแล้ว */}
          <div className="w-full bg-white p-6 shadow-md">
            <div className="flex items-center space-x-4 ml-10">
              <div className="w-15 h-15 bg-[#358C1B] rounded-full flex items-center justify-center">
                <Check className="text-white w-11 h-11" />
              </div>
              <div>
                <p className="font-bold ml-5">การชำระเงินได้รับการอนุมัติแล้ว</p>
                <p className="ml-10">
                ผู้ขายได้รับคำสั่งซื้อของคุณแล้ว สามารถติดต่อผู้ขายได้ที่ <Link to=""><u>แชทพูดคุย</u></Link> 
                </p>
              </div>
            </div>
          </div>

        
        



         

        </div>
      </div>
    </div>
  );
}

export default NotificationPage;
