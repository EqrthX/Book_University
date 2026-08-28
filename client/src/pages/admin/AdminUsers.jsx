import { useEffect, useState } from 'react';
import axios from '../../util/axios.js';
import toast from 'react-hot-toast';
import { Users, Shield, Trash2, Mail, User, Activity, AlertTriangle, Key } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/admin/users', { withCredentials: true });
      setUsers(res.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('ไม่สามารถดึงข้อมูลรายชื่อผู้ใช้ได้', { id: 'fetch-users-error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/admin/users/${userId}/role`, { role: newRole }, { withCredentials: true });
      toast.success('อัปเดตสิทธิ์การเข้าใช้งานเรียบร้อยแล้ว');
      
      // Update state local
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, user_role: newRole } : u));
    } catch (error) {
      console.error('Role update error:', error);
      toast.error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการอัปเดตสิทธิ์');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/admin/users/${userId}`, { withCredentials: true });
      toast.success('ลบบัญชีผู้ใช้งานสำเร็จ');
      setUsers(prev => prev.filter(u => u.id !== userId));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.error || 'ไม่สามารถลบผู้ใช้งานได้');
    }
  };

  // Helper to format activity status
  const getActivityStatus = (lastActiveAt) => {
    if (!lastActiveAt) return { label: 'Inactive', color: 'bg-slate-400 text-slate-700 bg-slate-100', dot: 'bg-slate-400' };
    
    const now = new Date();
    const activeDate = new Date(lastActiveAt);
    const diffMs = now - activeDate;
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 10) {
      return { label: 'Active Now', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500 animate-ping' };
    } else if (diffMins < 60 * 24) {
      return { label: 'Active Today', color: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500' };
    } else {
      return { label: 'Inactive', color: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
    }
  };

  // Format date readable
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full text-slate-800">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1E3B] flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            การจัดการผู้ใช้งานระบบ
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            ตรวจสอบรายชื่อผู้เข้าใช้งานทั้งหมด ประวัติกิจกรรม สิทธิ์ของบัญชี และความถี่การเข้าสู่ระบบ
          </p>
        </div>
        <button 
          onClick={fetchUsers}
          className="btn btn-outline border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-bold text-xs rounded-xl px-4 flex items-center gap-2"
        >
          <Activity className="w-4 h-4" />
          รีเฟรชข้อมูล
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <span className="loading loading-spinner loading-lg text-blue-600"></span>
          <span className="text-sm text-slate-400 font-semibold mt-4">กำลังโหลดรายชื่อผู้ใช้งาน...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-300">
          <Users className="w-16 h-16 mb-2" />
          <span className="text-sm font-semibold">ไม่พบผู้ใช้งานรายอื่นในระบบ</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-slate-100 rounded-2xl shadow-sm">
          <table className="table table-zebra w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-extrabold text-xs uppercase border-b border-slate-100">
                <th className="py-4 pl-6">ผู้ใช้งาน</th>
                <th className="py-4">รหัสนักศึกษา</th>
                <th className="py-4">วิธีการล็อกอิน</th>
                <th className="py-4">สิทธิ์การเข้าถึง</th>
                <th className="py-4">สถานะล่าสุด</th>
                <th className="py-4">ล็อกอินสะสม</th>
                <th className="py-4 pr-6 text-center">จัดการบัญชี</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => {
                const status = getActivityStatus(userItem.lastActiveAt);
                return (
                  <tr key={userItem.id} className="hover:bg-slate-50/50 border-b border-slate-100 transition-colors">
                    {/* User profile details */}
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 font-extrabold text-sm uppercase">
                          {userItem.fullName ? userItem.fullName.charAt(0) : 'U'}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800 text-sm">{userItem.fullName || 'Unregistered'}</p>
                          <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {userItem.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Student ID */}
                    <td className="py-4">
                      <span className="font-semibold text-slate-650 text-sm">
                        {userItem.studentId || <span className="text-slate-350 italic">ไม่มีข้อมูล</span>}
                      </span>
                    </td>

                    {/* Auth type */}
                    <td className="py-4">
                      {userItem.googleId ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-[10px] font-bold">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.706 0 3.257.618 4.471 1.637l2.422-2.424C17.47 1.83 15.02 1 12.24 1 6.58 1 2 5.58 2 11.24s4.58 10.24 10.24 10.24c5.795 0 10.254-4.074 10.254-10.24 0-.695-.08-1.355-.22-1.955H12.24z"/>
                          </svg>
                          Google Login
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-[10px] font-bold">
                          <Key className="w-3 h-3" />
                          Password
                        </span>
                      )}
                    </td>

                    {/* Role selector dropdown */}
                    <td className="py-4">
                      <div className="relative">
                        <select 
                          className="select select-bordered select-xs w-28 bg-white font-bold text-xs rounded-lg py-1 px-2 border-slate-200 focus:outline-none"
                          value={userItem.user_role}
                          onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                        >
                          <option value="student">Student</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>

                    {/* Active Status Badge */}
                    <td className="py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1.5 w-max px-2.5 py-1 rounded-full text-[10px] font-bold border ${status.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                          {status.label}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold">
                          ใช้งานเมื่อ: {formatDate(userItem.lastActiveAt)}
                        </span>
                      </div>
                    </td>

                    {/* Login frequency */}
                    <td className="py-4">
                      <span className="font-extrabold text-slate-700 text-sm">
                        {userItem.loginCount || 0}
                      </span>
                      <span className="text-slate-400 font-bold text-xs ml-1">ครั้ง</span>
                    </td>

                    {/* Actions buttons */}
                    <td className="py-4 pr-6 text-center">
                      <button 
                        onClick={() => setDeleteConfirmId(userItem.id)}
                        className="btn btn-ghost btn-xs text-rose-500 hover:bg-rose-50 rounded-lg hover:text-rose-600 transition-colors p-1"
                        title="ลบบัญชีผู้ใช้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200 text-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">ลบบัญชีผู้ใช้งาน</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">ยืนยันต้องการลบอย่างถาวรใช่หรือไม่?</p>
              </div>
            </div>
            <p className="text-slate-500 font-semibold text-xs leading-relaxed mb-6">
              การกระทำนี้จะไม่สามารถย้อนกลับได้ บัญชีผู้ใช้นี้จะถูกนำออกจากระบบถาวรและไม่สามารถลงชื่อเข้าใช้งานได้อีก
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs transition-all duration-200 cursor-pointer text-center text-slate-600"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirmId)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-md shadow-red-500/10 hover:shadow-red-500/20 hover:scale-[1.01] transition-all duration-200 cursor-pointer text-center"
              >
                ลบผู้ใช้งาน
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
