import { useEffect, useState } from "react";
import BGUni from "../../assets/bg.jpeg";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from '../../util/axios.js'

const statusColor = [
  {name: "in_progress", color: "bg-[#3D6299]"},
  {name: "completed", color: "bg-[#26A334]"},
  {name: "Not_Approved", color: "bg-[#D93619]"},
  {name: "ReportAProblem", color: "bg-[#E3CC18]"},
]

const AdminCheckPayment = () => {
  const [isOpen, setIsOpen] = useState(false); // ใช้ state เพื่อจัดการการแสดงผล

  const toggleDropdown = () => {
    setIsOpen(!isOpen); // เปลี่ยนสถานะการแสดงเมนูดรอปดาวน์
  };
  const navigator = useNavigate()
  const [statusPayment, setStatusPayment] = useState([])

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await axios.get("/show-status-payment", {withCredentials: true})

      if(res.status === 200) {
        setStatusPayment(res.data.statusPayment)
      }
    }

    fetchStatus()
  }, [])  
  

  return (
    <div className="w-full min-h-screen relative">
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

      <div className="absolute inset-0 bg-[#405d81] opacity-50"></div>
        <div className="relative p-10">
          <h3 className="font-semibold text-3xl text-black pr-190 mb-6 mt-15 ml-10 ">ตรวจสอบสถานะการเงิน</h3>
        </div>

        
      {/* เนื้อหา */}
      <div className="relative w-full min-h-screen flex flex-col items-center p-10 -my-20">


        {/* ปุ่ม Filter */}
        <div className="w-full flex justify-end mb-10">
          <div className="relative">
            <button
              className="flex items-center px-10 py-2 border border-black bg-white text-black rounded-sm mx-30 "
              onClick={toggleDropdown} 
            >
              <ChevronDown className="w-4 h-4 ml-1" /> Filter
            </button>
            {/* Dropdown */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg items-center">
                <ul>
                  <li className="flex items-center px-4 py-2 hover:bg-gray-300 text-black cursor-pointer mt-1">
                    <span className="inline-block w-4 h-4 rounded-full bg-[#26A334] mr-2"></span>{" "}
                    อนุมัติ
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-300 text-black cursor-pointer mt-1">
                    <span className="inline-block w-4 h-4 rounded-full bg-[#A80F0F] mr-2"></span>{" "}
                    ไม่อนุมัติ
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-300 text-black cursor-pointer mt-1 mb-1">
                    <span className="inline-block w-4 h-4 rounded-full bg-[#E3CC18] mr-2"></span>{" "}
                    แจ้งปัญหา
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* กล่องข้อมูล */}
        <div className="grid grid-cols-2 gap-20 my-10">
          {statusPayment.map((item, index) => (
            <div
              onClick={() => navigator(`/admin/AdminHomepage/check-payment/details-payment/${item.transaction_id}`)}
              key={index} 
              className="flex justify-between items-center w-100 bg-white p-4 shadow-md cursor-pointer "
            > 
              <div>
                <u>
                  <p>หมายเลขคำสั่งซื้อ</p>
                </u>
                <p className="text-gray-600 mt-2 ml-7">{item.transaction_id}</p>
              </div>
              <div className="flex items-center">
                <span className="mr-3 ">ตรวจสอบ</span>
                
                {statusColor.find(status => status.name === item.status) ? (
                  <span className={`w-4 h-4 rounded-full mr-5 ${statusColor.find(status => status.name === item.status).color}`}></span>
                ) : (
                  <span className="text-lg animate-bounce text-red-500">ไม่พบสถานะ</span>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminCheckPayment;
