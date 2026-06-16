import { SERVER_URL } from '../../util/axios.js';
import { useEffect, useState } from "react";
import axios from "../../util/axios.js";
import { getMessagePayment } from "../../util/helper.js";
import { formatDate, formatTime } from "../../util/helper.js";
import { ShoppingCart, Mail, User, MapPin, Calendar, Clock, CreditCard, ChevronRight } from "lucide-react";
 
const OrderPage = () => {
  const [studentId, setStudentId] = useState("");
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  const [activeTab, setActiveTab] = useState("delivery"); // "delivery" | "pickup"
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("/auth/protected", { withCredentials: true });
        setStudentId(res.data.user.studentId);
        setProfile(res.data.user);

        const resBookHistoryOrder = await axios.get("/show-history-order", {withCredentials: true})
        setBooks(resBookHistoryOrder.data.historyOrder || [])
      } catch (error) {
        console.error("Error fetching user profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const deliveryOrders = books.filter((book) => book.type === "delivery")
  const pickupOrders = books.filter((book) => book.type === "pickup")

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16 font-sans text-slate-800">
            
      {/* Title Header */}
      <div className="pt-8 px-6 md:px-10 max-w-6xl mx-auto mt-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#2d3695]/10 text-[#2d3695] rounded-2xl">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl text-slate-800">รายการคำสั่งซื้อของฉัน</h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              ตรวจสอบหนังสือที่คุณลงขายเมื่อผู้ซื้อทำการกดสั่งซื้อเข้ามา
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Menu selectors */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 mb-8">
        <div className="flex bg-slate-200/60 p-1 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab("delivery")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer ${
              activeTab === "delivery"
                ? "bg-[#2F5792] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            📦 จัดส่งพัสดุ ({deliveryOrders.length})
          </button>
          <button 
            onClick={() => setActiveTab("pickup")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer ${
              activeTab === "pickup"
                ? "bg-[#2F5792] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            🤝 นัดรับสินค้า ({pickupOrders.length})
          </button>
        </div>
      </div>

      {/* Orders container */}
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-[#2d3695]"></span>
          </div>
        ) : (
          <>
            {/* EMS Deliver tab panel */}
            {activeTab === "delivery" && (
              <div>
                {deliveryOrders.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 max-w-md mx-auto shadow-sm px-6">
                    <ShoppingCart className="w-16 h-16 mx-auto text-slate-300 mb-3 animate-pulse" />
                    <h3 className="text-base font-bold text-slate-700">ไม่มีข้อมูลการจัดส่งพัสดุ</h3>
                    <p className="text-slate-400 text-xs mt-1 font-semibold">เมื่อมีผู้นักศึกษาสั่งซื้อหนังสือเรียนของคุณผ่านระบบไปรษณีย์ รายการจะแสดงขึ้นที่นี่</p>
                  </div>
                ) : (
                  deliveryOrders.map((book) => (
                    <div
                      key={book.id}
                      className="p-5 md:p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 mb-6 flex flex-col lg:flex-row gap-6 justify-between items-start"
                    > 
                      {/* Image & Type column */}
                      <div className="flex flex-row lg:flex-col items-center gap-4 w-full lg:w-auto">
                        <div className="relative w-32 h-40 flex-shrink-0 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                          <img
                            className="w-full h-full object-contain"
                            src={`${SERVER_URL}/${book.bookPic.replace(/\\/g, "/")}`}
                            alt={book.titleBook}
                          />
                        </div>
                        <div className="flex flex-col gap-2 w-full lg:w-auto">
                          <span className="px-3.5 py-1 text-[10px] font-bold rounded-full bg-red-50 text-red-600 border border-red-200/50 text-center uppercase tracking-wide">
                            จัดส่งพัสดุ
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold text-center hidden lg:block">ID: #{book.id}</span>
                        </div>
                      </div>

                      {/* Book & Buyer detail column */}
                      <div className="flex-1 w-full flex flex-col gap-4 text-xs font-semibold text-slate-600">
                        <div>
                          <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">ชื่อหนังสือเรียน</h4>
                          <p className="text-base font-bold text-slate-800">{book.titleBook}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                          <div>
                            <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <User className="w-3.5 h-3.5" /> ข้อมูลผู้ซื้อ
                            </h4>
                            <p className="text-slate-800 font-bold">{book.Address_full_name}</p>
                            <p className="text-slate-500 font-semibold text-[11px] mt-0.5 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" /> {book.Address_email}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> ที่อยู่จัดส่งพัสดุ
                            </h4>
                            <p className="text-slate-700 leading-relaxed break-words font-bold">
                              {book.house_no || ""}, {book.street || ""}, {book.zone || ""}, {book.subdistrict || ""}, {book.district || ""}, {book.province || ""}, {book.zip_code || ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment & Status column */}
                      <div className="w-full lg:w-64 flex flex-col gap-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-100 shadow-inner text-xs font-semibold text-slate-600">
                        <div>
                          <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5" /> ข้อมูลการชำระเงิน
                          </h4>
                          <p className="text-slate-800 font-bold mt-1">ชำระผ่าน {getMessagePayment(book.payment_method)}</p>
                        </div>

                        <div className="flex flex-col gap-1.5 pt-2.5 border-t border-slate-200">
                          <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> วันที่และเวลาโอนเงิน
                          </h4>
                          {book.payment_datetime ? (
                            <div className="flex flex-wrap gap-1.5 text-[11px] font-bold text-slate-700">
                              <span className="bg-white px-3 py-1 rounded-lg border border-slate-200">{formatDate(book.payment_datetime)}</span>
                              <span className="bg-white px-3 py-1 rounded-lg border border-slate-200">{formatTime(book.payment_datetime)}</span>
                            </div>
                          ) : (
                            <p className="text-slate-400 font-bold">ไม่มีข้อมูลการโอน</p>
                          )}
                        </div>

                        <div className="pt-2.5 border-t border-slate-200">
                          <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">สถานะคำสั่งซื้อ</h4>
                          <span className={`inline-flex px-3.5 py-1.5 rounded-xl text-xs font-extrabold border ${
                            book.status === "completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                              : "bg-amber-50 text-amber-700 border-amber-200/50"
                          }`}>
                            {book.status === "completed" ? "ชำระเงินแล้ว" : "รอการชำระเงิน"}
                          </span>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pickup tab panel */}
            {activeTab === "pickup" && (
              <div>
                {pickupOrders.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 max-w-md mx-auto shadow-sm px-6">
                    <ShoppingCart className="w-16 h-16 mx-auto text-slate-300 mb-3 animate-pulse" />
                    <h3 className="text-base font-bold text-slate-700">ไม่มีข้อมูลการนัดรับสินค้า</h3>
                    <p className="text-slate-400 text-xs mt-1 font-semibold">เมื่อมีผู้นักศึกษาสั่งซื้อหนังสือเรียนของคุณผ่านระบบนัดรับในมหาวิทยาลัย รายการจะแสดงขึ้นที่นี่</p>
                  </div>
                ) : (
                  pickupOrders.map((book) => (
                    <div
                      key={book.id}
                      className="p-5 md:p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 mb-6 flex flex-col lg:flex-row gap-6 justify-between items-start"
                    >
                      {/* Image & Type column */}
                      <div className="flex flex-row lg:flex-col items-center gap-4 w-full lg:w-auto">
                        <div className="relative w-32 h-40 flex-shrink-0 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                          <img
                            className="w-full h-full object-contain"
                            src={`${SERVER_URL}/${book.bookPic.replace(/\\/g, "/")}`}
                            alt={book.titleBook}
                          />
                        </div>
                        <div className="flex flex-col gap-2 w-full lg:w-auto">
                          <span className="px-3.5 py-1 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200/50 text-center uppercase tracking-wide">
                            นัดรับใน ม.
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold text-center hidden lg:block">ID: #{book.id}</span>
                        </div>
                      </div>

                      {/* Book details, Buyer info & Location detail */}
                      <div className="flex-1 w-full flex flex-col gap-4 text-xs font-semibold text-slate-600">
                        <div>
                          <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">ชื่อหนังสือเรียน</h4>
                          <p className="text-base font-bold text-slate-800">{book.titleBook}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                          <div>
                            <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <User className="w-3.5 h-3.5" /> ข้อมูลผู้ซื้อ
                            </h4>
                            <p className="text-slate-800 font-bold">{book.fullName}</p>
                            <p className="text-slate-500 font-semibold text-[11px] mt-0.5 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" /> {book.email}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> สถานที่นัดรับภายใน ม.
                            </h4>
                            <p className="text-slate-800 font-extrabold bg-blue-50/50 text-[#2f5792] p-2.5 rounded-xl border border-blue-100/50 w-fit">
                              {book.location || "ไม่มีข้อมูลสถานที่"}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100">
                          <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> วันเวลาที่นัดหมาย
                          </h4>
                          {book.pickup_datetime ? (
                            <div className="flex flex-wrap gap-1.5 text-[11px] font-bold text-slate-700">
                              <span className="bg-[#2d3695]/5 text-[#2d3695] border border-[#2d3695]/15 px-3 py-1.5 rounded-lg flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" /> {formatDate(book.pickup_datetime)}
                              </span>
                              <span className="bg-[#2d3695]/5 text-[#2d3695] border border-[#2d3695]/15 px-3 py-1.5 rounded-lg flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {formatTime(book.pickup_datetime)}
                              </span>
                            </div>
                          ) : (
                            <p className="text-slate-400 font-bold">ไม่มีข้อมูลเวลานัดรับ</p>
                          )}
                        </div>
                      </div>

                      {/* Payment & Status column */}
                      <div className="w-full lg:w-64 flex flex-col gap-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-100 shadow-inner text-xs font-semibold text-slate-600">
                        <div>
                          <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5" /> ข้อมูลการชำระเงิน
                          </h4>
                          <p className="text-slate-800 font-bold mt-1">ชำระผ่าน {getMessagePayment(book.payment_method)}</p>
                        </div>

                        <div className="flex flex-col gap-1.5 pt-2.5 border-t border-slate-200">
                          <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> วันที่และเวลาที่โอนเงิน
                          </h4>
                          {book.payment_datetime ? (
                            <div className="flex flex-wrap gap-1.5 text-[11px] font-bold text-slate-700">
                              <span className="bg-white px-3 py-1 rounded-lg border border-slate-200">{formatDate(book.payment_datetime)}</span>
                              <span className="bg-white px-3 py-1 rounded-lg border border-slate-200">{formatTime(book.payment_datetime)}</span>
                            </div>
                          ) : (
                            <p className="text-slate-400 font-bold">ไม่มีข้อมูลการโอน</p>
                          )}
                        </div>

                        <div className="pt-2.5 border-t border-slate-200">
                          <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">สถานะการนัดรับ</h4>
                          <span className={`inline-flex px-3.5 py-1.5 rounded-xl text-xs font-extrabold border ${
                            book.status === "completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                              : "bg-amber-50 text-amber-700 border-amber-200/50"
                          }`}>
                            {book.status === "completed" ? "ชำระเงินเรียบร้อย" : "ยังไม่ได้ชำระเงิน"}
                          </span>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default OrderPage;
