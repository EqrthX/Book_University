import React, { useEffect, useState } from 'react';
import Head from "./components/Head.jsx";
import Navbar from "./components/Navdar.jsx";
import { Bell, X, Check, ShoppingCart } from 'lucide-react';
import axios from '../../util/axios.js';
import { useNavigate } from 'react-router-dom';

function NotificationPage() {
  const [notification, setNotification] = useState([]);
  const [user, setUser] = useState({ userId: "", studentId: "" });
  const navigator = useNavigate()

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // ตรวจสอบการเข้าสู่ระบบ
        const authRes = await axios.get('/auth/protected', { withCredentials: true });
        setUser({ userId: authRes.data.user.id, studentId: authRes.data.user.studentId });

        // ดึงข้อมูลการแจ้งเตือน
        const notificationRes = await axios.get('/notifications/getNotifications', { withCredentials: true });

        // กรองข้อมูลซ้ำโดยใช้ Map เพื่อเก็บเฉพาะ id ที่ไม่ซ้ำ
        const uniqueNotifications = Array.from(
          new Map(notificationRes.data.notifications.map(item => [item.id, item])).values()
        );
        setNotification(uniqueNotifications || []);


      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const changeStatusRead = async (id) => {
    try {
      await axios.put('/notifications/updateNotificationStatus', { id }, { withCredentials: true });
      setNotification((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: "read" } : item))
      );
      
      const thisNoti = notification.find((item) => item.id === id)

      if(thisNoti?.order_status?.includes("Not_Approved")) {
        navigator(`/user/UpdateSlip/${id}`);
      }
      
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

  const ordersStatus = (status) => {
    switch (status) {
      case "in_progress":
        return "กำลังดำเนินการ";
      case "completed":
        return "การสั่งซื้อของคุณเรียบร้อย";
      case "Not_Approved":
        return "การสั่งซื้อของคุณไม่ได้รับการอนุมัติ";
      case "ReportAProblem":
        return "แจ้งปัญหา";
      default:
        return "สถานะไม่ทราบ";
    }
  };

  const colorStatus = (status) => {
    switch (status) {
      case "in_progress":
        return "#2E3191";
      case "completed":
        return "#358C1B";
      case "Not_Approved":
        return "#9F0505";
      case "ReportAProblem":
        return "#ffea00";
      default:
        return "#000000";
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <Head studentId={user.studentId} />
      <Navbar />

      <div className="pt-16 px-6 md:px-20 mt-20">
        <div className="flex items-center mb-6 ml-10">
          <Bell className="w-10 h-10 text-[#2d3695]" />
          <h1 className="font-bold text-2xl ml-3">แจ้งเตือน</h1>
        </div>

        <div className="flex flex-col space-y-6">
          {notification.map((item) => (
            <div
              key={item.id}
              className={`w-full p-6 shadow-md ${
                item.status === "unread" ? "bg-gray-300" : "bg-white"
              } transition-colors hover:bg-gray-200 cursor-pointer`}
              onClick={() => changeStatusRead(item.id)}
            >
              <div className="flex items-center space-x-4 ml-10">
                <div
                  className="w-15 h-15 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colorStatus(item.order_status || "default") }}
                >
                  {item.order_status === "Not_Approved" && <X className="text-white w-11 h-11" />}
                  {item.order_status === "completed" && <Check className="text-white w-11 h-11" />}
                  {item.order_status === "in_progress" && (
                    <ShoppingCart className="text-white w-11 h-11" />
                  )}
                  {item.order_status === "ReportAProblem" && (
                    <span className="text-black text-5xl font-bold">!</span>
                  )}
                </div>
                <div>
                  <p className="font-bold ml-5">{item.title_message || "ไม่มีหัวข้อ"}</p>
                  <p className="ml-10">{item.message || "ไม่มีข้อความ"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotificationPage;
