import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios, { SERVER_URL } from '../../util/axios.js';
import { ChevronLeft, Check, X, AlertTriangle, ArrowRight, User, ShoppingBag, CreditCard, Image, FileText } from "lucide-react";
import toast from "react-hot-toast";

const getStatusBadge = (status) => {
  switch (status) {
    case "in_progress":
      return { label: "กำลังดำเนินการ", bg: "bg-blue-50 text-blue-700 border-blue-100", dot: "bg-blue-500" };
    case "completed":
      return { label: "เสร็จสมบูรณ์", bg: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" };
    case "Not_Approved":
      return { label: "ไม่ได้รับการอนุมัติ", bg: "bg-red-50 text-red-700 border-red-100", dot: "bg-red-500" };
    case "ReportAProblem":
      return { label: "แจ้งปัญหา", bg: "bg-amber-50 text-amber-700 border-amber-100", dot: "bg-amber-500" };
    default:
      return { label: "ไม่ทราบสถานะ", bg: "bg-slate-50 text-slate-700 border-slate-100", dot: "bg-slate-500" };
  }
};

function AdminDetailsPayment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const useModal = useRef(null);

  const [paymentDeatails, setPaymentDetails] = useState({});
  const [books, setBooks] = useState([]);
  const [updateStatus, setUpdateStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [title_message, setTitleMessage] = useState("");
  const [message, setMessage] = useState("");

  const handleChangeStatus = async (value) => {
    try {
      setUpdateStatus(value);
      setIsLoading(true);
      
      if (useModal.current) {
        useModal.current.showModal();
      }

      const res = await axios.put(`/admin/update-order-status/${id}`, {
        Title_message: title_message || "อัปเดตสถานะธุรกรรม",
        message: message || `ธุรกรรมได้รับการอัปเดตสถานะเป็น: ${getStatusBadge(value).label}`,
        status: value,
      }, { withCredentials: true });

      if (res.status === 200) {
        toast.success("อัปเดตสถานะสำเร็จ");
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating order status: ", error);
      toast.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
      if (useModal.current) {
        useModal.current.close();
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchInformation = async () => {
      try {
        const resInfo = await axios.get(`/admin/show-information/${id}`, { withCredentials: true });
        setPaymentDetails(resInfo.data.infomation || {});
        setBooks(resInfo.data.showBooks || []);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    };
    fetchInformation();
  }, [id]);

  const badgeInfo = getStatusBadge(paymentDeatails.order_status || "in_progress");

  return (
    <div className="w-full font-sans text-slate-800">
      {/* Top bar with back button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate("/admin/AdminHomepage/check-payment")}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 flex items-center">
              <span>ตรวจสอบรายละเอียดคำสั่งซื้อ</span>
              <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeInfo.bg}`}>
                {badgeInfo.label}
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">หมายเลขธุรกรรม: <span className="font-mono font-bold text-slate-700">{paymentDeatails.transaction_id || id}</span></p>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button 
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-[#26A334] hover:bg-[#1E8229] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-500/10 active:scale-95 transition-all"
            onClick={() => handleChangeStatus("completed")}
          >
            <Check className="w-4 h-4" />
            <span>อนุมัติ</span>
          </button>

          <button 
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-[#D93619] hover:bg-[#A8260F] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-red-500/10 active:scale-95 transition-all"
            onClick={() => handleChangeStatus("Not_Approved")}
          >
            <X className="w-4 h-4" />
            <span>ปฏิเสธ</span>
          </button>
          
          <button 
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-[#E3CC18] hover:bg-[#BDB014] text-slate-900 px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-yellow-500/10 active:scale-95 transition-all"
            onClick={() => handleChangeStatus("ReportAProblem")}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>แจ้งปัญหา</span>
          </button>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (Order info) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Books details */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
              <ShoppingBag className="w-4 h-4 mr-2 text-slate-500" />
              หนังสือที่ทำการสั่งซื้อ ({books.length})
            </h3>
            
            <div className="space-y-4">
              {books.map((book) => {
                const bookCover = book.book_bookPic
                  ? `${SERVER_URL}/${book.book_bookPic.replace(/\\/g, "/")}`
                  : "https://via.placeholder.com/150";

                return (
                  <div key={book.book_id} className="flex items-center space-x-4 bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                    <img
                      src={bookCover}
                      alt={book.book_titleBook || "Book"}
                      className="w-16 h-20 object-cover rounded-lg border border-slate-100"
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm leading-snug">{book.book_titleBook}</h4>
                      <p className="text-xs text-slate-400 mt-1">Book ID: <span className="font-mono">{book.book_id}</span></p>
                      <p className="text-sm font-black text-blue-600 mt-1">{book.book_price} ฿</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User & Seller Profile Info */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buyer */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                <User className="w-4 h-4 mr-2 text-slate-500" />
                ข้อมูลผู้ซื้อ
              </h3>
              <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-2 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">ชื่อ-นามสกุล</span>
                  <span className="font-bold text-slate-800">{paymentDeatails.user_fullName || "N/A"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">อีเมลติดต่อ</span>
                  <span className="font-medium text-slate-600">{paymentDeatails.user_email || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Seller */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                <User className="w-4 h-4 mr-2 text-slate-500" />
                ข้อมูลผู้ขาย
              </h3>
              <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-2 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">ชื่อ-นามสกุล</span>
                  <span className="font-bold text-slate-800">{paymentDeatails.seller?.seller_fullName || "N/A"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">อีเมลติดต่อ</span>
                  <span className="font-medium text-slate-600">{paymentDeatails.seller?.seller_email || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Slip proof & form values) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Slip image container */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
              <Image className="w-4 h-4 mr-2 text-slate-500" />
              หลักฐานการโอนเงิน
            </h3>
            
            <div className="bg-white border border-slate-200/60 rounded-xl p-3 flex justify-center items-center relative group overflow-hidden aspect-square shadow-inner">
              {paymentDeatails.slip_image ? (
                <img 
                  src={`${SERVER_URL}/${paymentDeatails.slip_image.replace(/\\/g, "/")}`}
                  className="max-h-full max-w-full object-contain rounded-lg shadow-sm hover:scale-102 transition-transform duration-300 cursor-zoom-in"
                  alt="Transfer Slip"
                  onClick={() => window.open(`${SERVER_URL}/${paymentDeatails.slip_image.replace(/\\/g, "/")}`, "_blank")}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-300 py-20">
                  <Image className="w-12 h-12 mb-2" />
                  <span className="text-sm">ไม่มีหลักฐานแนบมา</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment & Transfer data Form */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
              <CreditCard className="w-4 h-4 mr-2 text-slate-500" />
              ข้อมูลรายละเอียดการชำระเงิน
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-400 block font-semibold">ช่องทางชำระเงิน</span>
                <span className="font-bold text-slate-700 bg-white border border-slate-100 px-3 py-2 rounded-xl block mt-1">
                  {paymentDeatails.payment_method === "qrCode" ? "QR Code / โอนเงิน" : "คิวอาร์โค้ด"}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold">ยอดโอน (ราคาสินค้า)</span>
                <span className="font-extrabold text-blue-600 bg-white border border-slate-100 px-3 py-2 rounded-xl block mt-1">
                  {paymentDeatails.order_totalPrice} ฿
                </span>
              </div>
            </div>

            <div className="text-sm">
              <span className="text-xs text-slate-400 block font-semibold">วันที่และเวลาโอน</span>
              <span className="font-bold text-slate-700 bg-white border border-slate-100 px-3 py-2 rounded-xl block mt-1">
                {paymentDeatails.payment_datetime || "ไม่ระบุข้อมูล"}
              </span>
            </div>

            {/* Notification config form */}
            <form className="border-t border-slate-200/60 pt-4 mt-4 space-y-4">
              <h3 className="text-sm font-bold text-slate-500 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-slate-400" />
                หัวข้อแจ้งเตือนนักศึกษา (กรณีปฏิเสธ/แจ้งปัญหา)
              </h3>
              
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-semibold">เลือกหัวข้อปัญหา</label>
                <select 
                  className="bg-white border border-slate-200 rounded-xl p-2.5 text-sm w-full outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-1 text-slate-700 font-semibold" 
                  onChange={(e) => setTitleMessage(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>-- เลือกหัวข้อการแจ้งปัญหา --</option>
                  <option value="ยังไม่ได้รับการชำระเงิน">ยังไม่ได้รับการชำระเงิน</option>
                  <option value="ยอดชำระไม่ถูกต้อง">ยอดชำระไม่ถูกต้อง</option>
                  <option value="ข้อมูลวันเวลาไม่ถูกต้อง">ข้อมูลวันเวลาไม่ถูกต้อง</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-semibold">คำอธิบายเพิ่มเติม</label>
                <input 
                  type="text" 
                  className="bg-white border border-slate-200 rounded-xl p-2.5 text-sm w-full outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-1"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  name="message"
                  placeholder="ระบุข้อความแจ้งถึงผู้ซื้อสินค้า..."
                />
              </div>
            </form>
          </div>

        </div>
      </div>

      {/* Modal Dialog popup */}
      <dialog ref={useModal} id="my_modal_1" className="modal">
        <div className="modal-box bg-white rounded-2xl flex flex-col justify-center items-center text-center p-8 border border-slate-100 shadow-2xl">
          <h3 className="font-extrabold text-xl text-slate-800 mb-6">
            อัปเดตสถานะธุรกรรม
          </h3>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center my-6">
              <span className="loading loading-spinner loading-lg text-blue-600"></span>
              <span className="text-sm font-semibold text-slate-400 mt-4">กำลังดำเนินการ...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center my-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-4 animate-bounce">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <span className="text-sm font-bold text-slate-700">อัปเดตสถานะเป็น "{getStatusBadge(updateStatus).label}" เรียบร้อย</span>
            </div>
          )}

          <div className="modal-action w-full mt-4 flex justify-center">
            <form method="dialog" className="w-full max-w-[200px]">
              <button 
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-500 hover:shadow-blue-500/30 transition-all text-sm active:scale-95"
                onClick={() => navigate(`/admin/AdminHomepage/check-payment`)}
              >
                เสร็จสิ้น
              </button>
            </form>
          </div>
        </div>
      </dialog>

    </div>
  );
}

export default AdminDetailsPayment;
