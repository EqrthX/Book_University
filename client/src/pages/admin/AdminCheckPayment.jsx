import { useEffect, useState } from "react";
import { ChevronDown, Wallet, CheckCircle, Clock, AlertCircle, FileText, ArrowRight, Calendar, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from '../../util/axios.js';

const statusColor = [
  { name: "in_progress", label: "รอดำเนินการ", bg: "bg-blue-50 text-blue-700 border-blue-100", dot: "bg-blue-500" },
  { name: "completed", label: "อนุมัติแล้ว", bg: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
  { name: "Not_Approved", label: "ไม่อนุมัติ", bg: "bg-red-50 text-red-700 border-red-100", dot: "bg-red-500" },
  { name: "ReportAProblem", label: "แจ้งปัญหา", bg: "bg-amber-50 text-amber-700 border-amber-100", dot: "bg-amber-500" },
];

const AdminCheckPayment = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [statusPayment, setStatusPayment] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get("/admin/show-status-payment", { withCredentials: true });
        if (res.status === 200) {
          setStatusPayment(res.data.statusPayment || []);
        }
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      }
    };
    fetchStatus();
  }, []);

  const handleFilterSelect = (status) => {
    setSelectedStatus(status);
    setIsOpen(false);
  };

  // Stats calculation
  const totalCount = statusPayment.length;
  const approvedCount = statusPayment.filter(item => item.status === 'completed').length;
  const pendingCount = statusPayment.filter(item => item.status === 'in_progress' || !item.status).length;
  const problemCount = statusPayment.filter(item => item.status === 'ReportAProblem' || item.status === 'Not_Approved').length;

  const filteredPayments = statusPayment
    .filter(item => {
      if (!selectedStatus) return true;
      return item.status === selectedStatus;
    })
    .filter(item => {
      if (!searchTerm) return true;
      return item.transaction_id?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

  return (
    <div className="w-full font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-5 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">ตรวจสอบสถานะการชำระเงิน</h1>
          <p className="text-sm text-slate-500 mt-1">จัดการคำขออนุมัติการโอนเงินและหลักฐานสลิปของนักศึกษา</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Payments */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center space-x-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">รายการทั้งหมด</span>
            <span className="text-2xl font-bold text-slate-800">{totalCount}</span>
          </div>
        </div>

        {/* Approved */}
        <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-2xl p-5 flex items-center space-x-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">อนุมัติแล้ว</span>
            <span className="text-2xl font-bold text-emerald-700">{approvedCount}</span>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-blue-50/30 border border-blue-100/50 rounded-2xl p-5 flex items-center space-x-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">รอดำเนินการ</span>
            <span className="text-2xl font-bold text-blue-700">{pendingCount}</span>
          </div>
        </div>

        {/* Reported Issues */}
        <div className="bg-amber-50/30 border border-amber-100/50 rounded-2xl p-5 flex items-center space-x-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">พบปัญหา / ปฏิเสธ</span>
            <span className="text-2xl font-bold text-amber-700">{problemCount}</span>
          </div>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80 flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            className="w-full bg-white pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
            placeholder="ค้นหาด้วยเลขคำสั่งซื้อ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative w-full sm:w-auto flex justify-end">
          <button
            className="flex items-center justify-between w-full sm:w-48 px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all text-slate-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="flex items-center">
              {selectedStatus ? (
                <>
                  <span className={`w-2.5 h-2.5 rounded-full mr-2 ${statusColor.find(s => s.name === selectedStatus)?.dot}`} />
                  {statusColor.find(s => s.name === selectedStatus)?.label}
                </>
              ) : (
                "แสดงตามสถานะ"
              )}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-500 ml-2" />
          </button>

          {isOpen && (
            <ul className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden text-sm">
              <li
                className="flex items-center px-4 py-3 hover:bg-slate-50 cursor-pointer text-slate-700 border-b border-slate-50"
                onClick={() => handleFilterSelect("")}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 mr-2" />
                ทั้งหมด
              </li>
              {statusColor.map(sc => (
                <li
                  key={sc.name}
                  className="flex items-center px-4 py-3 hover:bg-slate-50 cursor-pointer text-slate-700 border-b border-slate-50"
                  onClick={() => handleFilterSelect(sc.name)}
                >
                  <span className={`w-2.5 h-2.5 rounded-full mr-2 ${sc.dot}`} />
                  {sc.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Transaction List (Replacing Grid) */}
      <div className="space-y-3">
        {filteredPayments.length > 0 ? (
          filteredPayments.map((item, index) => {
            const statusInfo = statusColor.find(s => s.name === item.status) || {
              label: "ไม่พบสถานะ",
              bg: "bg-slate-50 text-slate-600 border-slate-100",
              dot: "bg-slate-400"
            };

            return (
              <div
                onClick={() => navigate(`/admin/AdminHomepage/check-payment/details-payment/${item.transaction_id}`)}
                key={index}
                className="group flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all duration-300 rounded-2xl p-5 gap-4 cursor-pointer"
              >
                {/* Transaction details columns */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-blue-50/50 flex items-center justify-center text-slate-600 group-hover:text-blue-600 transition-colors">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">หมายเลขคำสั่งซื้อ</span>
                    <span className="text-base font-extrabold text-slate-800 font-mono tracking-tight bg-slate-50 px-2 py-0.5 border border-slate-100 rounded-md">
                      {item.transaction_id || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Date / Payment channel metadata */}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.payment_datetime || "ไม่ได้ระบุ"}</span>
                  </div>
                </div>

                {/* Status and Action Buttons */}
                <div className="flex items-center justify-between w-full md:w-auto space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bg}`}>
                    {statusInfo.label}
                  </span>

                  <button className="flex items-center space-x-1 text-sm font-extrabold text-blue-600 group-hover:text-blue-700 transition-colors bg-blue-50/50 group-hover:bg-blue-50 px-3 py-1.5 rounded-xl">
                    <span>ตรวจสอบ</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
            <Wallet className="w-12 h-12 text-slate-300 mb-3 animate-pulse" />
            <p className="text-slate-500 font-medium">ไม่พบข้อมูลการชำระเงินที่ต้องการตรวจสอบ</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminCheckPayment;
