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
  const navigator = useNavigate()
  const [statusPayment, setStatusPayment] = useState([])
  const [selectedStatus, setSelectedStatus] = useState("")
  
  useEffect(() => {
    const fetchStatus = async () => {
      const res = await axios.get("/admin/show-status-payment", {withCredentials: true})
      
      if(res.status === 200) {
        setStatusPayment(res.data.statusPayment)
      }
    }
    
    fetchStatus()
  }, [])  
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen); // เปลี่ยนสถานะการแสดงเมนูดรอปดาวน์
    };
  
    const handleFilterSelect = (status) => {
      setSelectedStatus(status)
      setIsOpen(false)
    }
  
    const filteredPayments = selectedStatus ? statusPayment.filter((item) => item.status === selectedStatus) : statusPayment

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
              className="flex items-center px-4 py-2 border border-gray-300 rounded bg-white"
              onClick={() => setIsOpen(!isOpen)} // เปิด/ปิด Dropdown
            >
              {selectedStatus ? (
                <>
                  <span
                    className={`inline-block w-4 h-4 rounded-full mr-2 ${
                      statusColor.find((status) => status.name === selectedStatus)?.color
                    }`}
                  ></span>
                  {selectedStatus === "completed"
                    ? "อนุมัติ"
                    : selectedStatus === "Not_Approved"
                    ? "ไม่อนุมัติ"
                    : "แจ้งปัญหา"}
                </>
              ) : (
                "กรองตามสถานะ"
              )}
              <ChevronDown className="w-4 h-4 ml-2" />
          </button>

          {isOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
              <li
                className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  setSelectedStatus("completed");
                  setIsOpen(false);
                }}
              >
                <span className="inline-block w-4 h-4 rounded-full bg-[#26A334] mr-2"></span>
                อนุมัติ
              </li>
              <li
                className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  setSelectedStatus("Not_Approved");
                  setIsOpen(false);
                }}
              >
                <span className="inline-block w-4 h-4 rounded-full bg-[#D93619] mr-2"></span>
                ไม่อนุมัติ
              </li>
              <li
                className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  setSelectedStatus("ReportAProblem");
                  setIsOpen(false);
                }}
              >
                <span className="inline-block w-4 h-4 rounded-full bg-[#E3CC18] mr-2"></span>
                แจ้งปัญหา
              </li>
              <li
                className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  setSelectedStatus("");
                  setIsOpen(false);
                }}
              >
                <span className="inline-block w-4 h-4 rounded-full bg-gray-400 mr-2"></span>
                ทั้งหมด
              </li>
            </ul>
          )}

        </div>
      </div>

        {/* กล่องข้อมูล */}
        <div className="grid grid-cols-2 gap-20 my-10">
          {filteredPayments.map((item, index) => (
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
