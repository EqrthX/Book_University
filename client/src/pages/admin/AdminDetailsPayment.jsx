import { useNavigate, useParams } from "react-router-dom";
import BGUni from "../../assets/bg.jpeg";
import { useEffect, useRef, useState } from "react";
import axios from '../../util/axios.js'

const getStatusMessages = (status) => {
  switch (status) {

    case "in_progress" :
      return "กำลังดำเนินการ";

    case "completed":
      return "เสร็จสมบูรณ์";

    case "Not_Approved":
      return "ไม่ได้รับการอนุมัติ";

    case "ReportAProblem":
      return "แจ้งปัญหา";

    default:
      console.warn("Unknown status:", status); // แจ้งเตือนเมื่อค่าไม่ตรงกับเงื่อนไข
      return "ไม่ทราบสถานะ";
  }

}

function AdminDetailsPayment() {

  const {id} = useParams();
  const navigate = useNavigate()
  const useModal = useRef(null)

  const [paymentDeatails, setPaymentDetails] = useState([])
  const [books, setBooks] = useState([])
  const [updateStatus, setUpdateStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [title_message, setTitleMessage] = useState("")
  const [message, setMessage] = useState("")

  const handleChangeStatus = async (value) => {

    try {
      setUpdateStatus(value)
      setIsLoading(true)
      
      if(useModal.current) {
        useModal.current.showModal();
      }

      const updateOrdersStatus = await axios.put(`/admin/update-order-status/${id}`, 
        {
          
          Title_message: title_message,
          message: message,
          status: value,

        }, 
        {withCredentials: true}
      )

      if(updateOrdersStatus.status === 200) {
        console.log("Status updated successfully")

        setTimeout(() => {
          setIsLoading(false)
        }, 2000)
      }

    } catch (error) {
      console.error("Error updating order status: ", error)
    } finally {
      setIsLoading(false)
    }

  }
  
  useEffect(() => {
    const fetchInfomation = async () => {
      try {
        const resInfo = await axios.get(`/admin/show-information/${id}`, {withCredentials: true})

        setPaymentDetails(resInfo.data.infomation)
        setBooks(resInfo.data.showBooks)

      } catch (error) {
        console.error("Error fetching payment details:", error)
      }
    }

    fetchInfomation()
  }, [id])
  
  return (
    <div className="w-full min-h-screen relative flex flex-col items-center p-10 ">
      {/* พื้นหลัง */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${BGUni})`,
          backgroundColor: "#3B82F6",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
        }}
      ></div>
        {/* ข้อความ ตรวจสอบสถานะการเงิน */}
      <div className="absolute inset-0 bg-[#405d81] opacity-50"></div>
      <div className="relative p-10 z-10">
        <h3 className="font-semibold text-3xl text-black pr-180 mb-4 mt-3 ">ตรวจสอบสถานะการเงิน</h3>
        
         {/* ปุ่มการดำเนินการ 3 ปุ่ม บน*/}
         <div className="flex items-end justify-end space-x-5 mx-7 ">
            <button 
              className="bg-[#26A334] hover:bg-[#355c3a] text-white px-4 py-2 rounded"
              name="status"
              onClick={() => handleChangeStatus("completed")}
            >
              
                อนุมัติ
            </button>

            <button 
              className="bg-[#D93619] hover:bg-[#A80F0F] text-white px-4 py-2 rounded"
              name="status"
              onClick={() => handleChangeStatus("Not_Approved")}
            >
              ไม่อนุมัติ
            </button>
            
            <button 
              className="bg-[#E3CC18] hover:bg-[#A89214] text-black hover:text-white px-4 py-2 rounded"
              name="status"
              onClick={() => handleChangeStatus("ReportAProblem")}
            >
              แจ้งปัญหา
            </button>
        </div>

      </div>

      {/* เนื้อหาหลัก */}
        <div className="relative bg-[#F4F4F4] p-8 shadow-lg w-full max-w-5xl h-auto rounded-sm">
            
                {/* ข้อมูลคำสั่งซื้อ */}
                <div className="grid grid-cols-2 gap-4 text-gray-700">

                    <div className="flex flex-col items-center mt-5">
                        <h3 className="mb-2 font-bold ">หนังสือ</h3>
                        {/* รูปหนังสือ */}
                        <div className="carousel w-80 bg-white border-2 border-gray-400 rounded-lg h-80 overflow-hidden">
                          {books.map((book) => (
                            <div key={book.book_id} className="carousel-item w-full h-auto flex justify-center items-center">
                              <img
                                src={
                                  book.book_bookPic
                                    ? `http://localhost:5001/${book.book_bookPic.replace(/\\/g, "/")}`
                                    : "URL_TO_DEFAULT_IMAGE"
                                }
                                alt={book.titleBook || "Book"}
                                className="w-50 h-auto object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        
                    </div>

                    <div className="grid grid-cols-2 gap-4 my-auto mt-20 text-black  ">

                        {/* หมายเลขคำสั่งซื้ออยู่ข้างบน */}
                        <div>
                        <u><p className="font-medium">หมายเลขคำสั่งซื้อ</p></u>
                        <p className='ml-7'>{paymentDeatails.transaction_id}</p>
                        </div>

                        {/* อันนี้ทำหรอกไม่ได้ใช้ */}
                        <div><p className="font-medium"></p><p></p></div>
                        
                        {/* ชื่อ - นามสกุลผู้ซื้อ */}
                        <div>
                            <p className="font-medium">ชื่อ - นามสกุลผู้ซื้อ</p>
                            <p className='ml-7'>{paymentDeatails.user_fullName}</p>
                        </div>

                        {/* ชื่อ - นามสกุลผู้ขาย */}
                        <div>
                            <p className="font-medium">ชื่อ - นามสกุลผู้ขาย</p>
                            <p className='ml-7'>{paymentDeatails.seller?.seller_fullName || "ไม่พบข้อมูลผู้ขาย"}</p>
                        </div>

                        {/* อีเมล ผู้ซื้อ */}
                        <div>
                            <p className="font-medium">อีเมลผู้ซื้อ</p>
                            <p className='ml-7'>{paymentDeatails.user_email}</p>
                        </div>

                        {/* อีเมล ผู้ขาย */}
                        <div>
                            <p className="font-medium">อีเมลผู้ขาย</p>
                            <p className='ml-7'>{paymentDeatails.seller?.seller_email || "ไม่พบอีเมลผู้ขาย"}</p>
                        </div>
                    </div>
                </div>


                {/* ข้อมูลการชำระเงิน */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 mt-15 mx-35">ข้อมูลการชำระเงิน</h4>
                    <div className='ml-50'>
                        <h1 className="font-medium text-lg ">ชำระเงิน</h1>
                        <p className="mt-2 ml-7 ">{paymentDeatails.payment_method === "qrCode" ? "QR Code" : "คิวอาร์โค้ด"}</p>
                    </div>

                        <div className="grid grid-cols-2 gap-2 mt-5 ml-50 ">
                            <div className="flex flex-col">
                            
                            {/* ข้อมูลวันที่และเวลาการโอน */}
                            <p className="font-medium">วันที่และเวลาการโอน</p>
                            <div className="flex gap-2 mt-3">
                                <input type="text" className="border-2 border-gray-300 p-2 rounded w-50 ml-7" value={paymentDeatails.payment_datetime}/>
                            </div>

                            {/* ข้อมูลสถานะการชำระเงิน */}
                            <p className="font-medium mt-7">สถานะการชำระเงิน</p>
                            <input type="text" className="border-2 border-gray-300 p-2 rounded-sm w-50 mt-3 ml-7"  value={getStatusMessages(paymentDeatails.order_status)}/>

                            <p className="font-medium mt-7">ราคาสินค้า</p>
                            <input type="text" className="border-2 border-gray-300 p-2 rounded-sm w-50 mt-3 ml-7"  value={paymentDeatails.order_totalPrice}/>
                        </div>

                            {/* รูปหลักฐานการโอน */}
                            <div className="flex flex-col -my-30">
                                <p className="text-lg mb-3 -mx-7 ">หลักฐานการโอน</p>
                                <div className="w-80 h-80 bg-white border-2 border-gray-400 rounded-lg overflow-hidden">
                                  <img 
                                    src={paymentDeatails.slip_image ? `http://localhost:5001/${paymentDeatails.slip_image.replace(/\\/g, "/")}` : "URL_TO_DEFAULT_IMAGE"}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                            </div>
                        </div>
                </div>

                <form
                  className="flex flex-col items-center mt-5 justify-around" 
                >
                  <div className="flex flex-col mb-5 w-[500px]">
                    
                    
                    <select 
                      className="border-2 bg-white border-gray-300 p-2 rounded-sm w-[500px] mt-2" 
                      onChange={(e) => setTitleMessage(e.target.value)}
                    >
                      <option value="" disabled selected>เลือกหัวข้อ</option>
                      <option 
                        value="ยังไม่ได้รับการชำระเงิน" 
                      >
                        ยังไม่ได้รับการชำระเงิน 
                      </option>
                      <option 
                        value="ยอดชำระไม่ถูกต้อง" 
                      >
                        ยอดชำระไม่ถูกต้อง
                      </option>
                      <option 
                        value="ข้อมูลวันเวลาไม่ถูกต้อง" 
                      >
                        ข้อมูลวันเวลาไม่ถูกต้อง
                      </option>
                      <option 
                        value="อื่นๆ" 
                      >
                        อื่นๆ
                      </option>
                    </select>

                  </div>

                  <div className="flex flex-col mb-5 w-[500px]">
                    <label className="font-medium text-lg">คำอธิบาย</label>
                    <input 
                      type="text" 
                      className="border-2 bg-white border-gray-300 p-2 rounded-sm w-[500px] mt-2"
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                      name="message"
                    />
                  </div>
                </form>

                <dialog ref={useModal} id="my_modal_1" className="modal">
                  <div className="modal-box bg-white rounded-xl flex flex-col justify-center items-center text-center">
                    <h3 className="font-bold text-lg uppercase mb-4">
                      อัพเดตสถานะ {getStatusMessages(updateStatus)}
                    </h3>
                    {isLoading ? (
                      // แสดง spinner เมื่อ isLoading เป็น true
                      <span className="loading loading-spinner loading-xl"></span>
                    ) : (
                      // แสดงไอคอนติ๊กถูกเมื่อ isLoading เป็น false
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-12 h-12 text-green-500 flex justify-center"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </>
                    )}
                    <div className="modal-action mt-4">
                      <form method="dialog">
                        <button 
                          className="btn btn-lg bg-green-700 rounded-lg hover:bg-emerald-400"
                          onClick={() => navigate(`/admin/AdminHomepage/check-payment  `)}  
                        >
                          ปิด
                        </button>
                      </form>
                    </div>
                  </div>
                </dialog>

        </div>
    </div>
  );
}

export default AdminDetailsPayment;
