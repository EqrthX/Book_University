import React, { useEffect, useState } from 'react';
import { Bell, X, Check, ShoppingCart, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from '../../util/axios.js';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatTime } from '../../util/helper.js';

function NotificationPage() {
  const [notification, setNotification] = useState([]);
  const [user, setUser] = useState({ userId: "", studentId: "" });
  const navigate = useNavigate();

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
      window.dispatchEvent(new Event('notifications-updated'));
      
      const thisNoti = notification.find((item) => item.id === id);

      if (thisNoti?.order_status?.includes("Not_Approved")) {
        navigate(`/user/UpdateSlip/${id}`);
      }
      
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notification.filter(n => n.status === "unread");
    if (unreadNotifications.length === 0) return;
    
    try {
      // อัปเดตสถานะการแจ้งเตือนทั้งหมดในเซิร์ฟเวอร์
      await Promise.all(
        unreadNotifications.map(n =>
          axios.put('/notifications/updateNotificationStatus', { id: n.id }, { withCredentials: true })
        )
      );
      
      // อัปเดตสถานะในหน้าเว็บแบบ Real-time
      setNotification((prev) =>
        prev.map((item) => ({ ...item, status: "read" }))
      );
      
      // ส่ง Event เพื่อรีเฟรชตัวนับใน Navbar
      window.dispatchEvent(new Event('notifications-updated'));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const renderNotificationIcon = (orderStatus) => {
    switch (orderStatus) {
      case "completed":
        return (
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600 border border-emerald-100/50 shadow-sm">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
        );
      case "Not_Approved":
        return (
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-600 border border-rose-100/50 shadow-sm">
            <X className="w-6 h-6 stroke-[3]" />
          </div>
        );
      case "in_progress":
        return (
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600 border border-blue-100/50 shadow-sm">
            <ShoppingCart className="w-6 h-6 stroke-[2.5]" />
          </div>
        );
      case "ReportAProblem":
        return (
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-amber-50 text-amber-600 border border-amber-100/50 shadow-sm">
            <AlertCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-slate-50 text-slate-600 border border-slate-100 shadow-sm">
            <Bell className="w-6 h-6 stroke-[2.5]" />
          </div>
        );
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16 font-sans text-slate-800">
      
      {/* Title Header */}
      <div className="pt-8 px-6 md:px-10 max-w-4xl mx-auto mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#2F5792]/10 text-[#2F5792] rounded-2xl shadow-inner">
              <Bell className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-extrabold text-2xl text-slate-800">การแจ้งเตือนของฉัน</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                ติดตามอัปเดตสถานะและข้อมูลการทำธุรกรรมของคุณ
              </p>
            </div>
          </div>
          
          {notification.some(n => n.status === "unread") && (
            <button
              onClick={markAllAsRead}
              className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-white border border-slate-200 text-[#2F5792] hover:bg-slate-50 font-bold text-xs shadow-sm hover:shadow transition-all duration-300 cursor-pointer w-full sm:w-auto hover:border-slate-300"
            >
              <CheckCircle2 className="w-4.5 h-4.5" />
              <span>อ่านทั้งหมด</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications Container */}
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        {notification.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 max-w-md mx-auto shadow-sm px-6">
            <Bell className="w-16 h-16 mx-auto text-slate-300 mb-3 animate-pulse" />
            <h3 className="text-base font-bold text-slate-700">ไม่มีการแจ้งเตือน</h3>
            <p className="text-slate-400 text-xs mt-1 font-semibold leading-relaxed">
              คุณจะได้รับการแจ้งเตือนที่นี่เมื่อมีความคืบหน้าเกี่ยวกับคำสั่งซื้อและหนังสือเรียนของคุณ
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {notification.map((item) => {
              const isUnread = item.status === "unread";
              return (
                <div
                  key={item.id}
                  onClick={() => changeStatusRead(item.id)}
                  className={`p-5 rounded-3xl border transition-all duration-300 flex items-start gap-4 cursor-pointer relative overflow-hidden group shadow-sm hover:shadow-md ${
                    isUnread
                      ? "bg-[#2F5792]/5 border-l-4 border-l-[#2F5792] border-y-blue-100/40 border-r-blue-100/40"
                      : "bg-white border-slate-100 hover:bg-slate-50/50"
                  }`}
                >
                  {/* Glowing unread indicator dot */}
                  {isUnread && (
                    <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#2F5792] shadow-sm animate-pulse" />
                  )}

                  {/* Icon */}
                  {renderNotificationIcon(item.order_status)}

                  {/* Content block */}
                  <div className="flex-1 min-w-0 pr-4">
                    <p className={`text-slate-800 text-sm md:text-base ${isUnread ? 'font-extrabold' : 'font-bold'}`}>
                      {item.title_message || "ไม่มีหัวข้อ"}
                    </p>
                    <p className="text-slate-500 font-semibold text-xs md:text-sm mt-1 leading-relaxed break-words">
                      {item.message || "ไม่มีข้อความ"}
                    </p>
                    
                    {/* Timestamp */}
                    {item.created_at && (
                      <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] text-slate-400 font-semibold mt-2.5">
                        <span>{formatDate(item.created_at)}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <span>{formatTime(item.created_at)} น.</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationPage;
