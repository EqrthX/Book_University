import { useState } from "react";
import BannerUni from "../assets/Banner.png";
import BGUni from "../assets/bg.jpeg";
import { Link, useNavigate } from "react-router-dom";
import axios from "../util/axios.js";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { User, Lock, BookOpen } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const [values, setValues] = useState({
    studentId: "",
    password: ""
  }); 

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if(!values.studentId || !values.password) {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบ");
      setIsLoading(false);
      return;
    }

    try {
      const user = await login(values.studentId, values.password);
      const getRole = user.user_role || user.role;

      if(getRole === "admin") {
        navigate('/admin/AdminHomepage');
      } else if(getRole === "student") {
        navigate('/user/Homepage');
      } else {
        setErrorMessage("ไม่พบสิทธิ์ของผู้ใช้บัญชีนี้");
      }
      
      toast.success("เข้าสู่ระบบสำเร็จ");
    } catch (error) {
      if(error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        console.error("Login Page error: ", error);
        setErrorMessage(error.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0d1527] flex flex-col relative overflow-hidden font-sans text-slate-100">
      {/* Background Graphic Patterns */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${BGUni})` }}
      />
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Navbar */}
      <nav className="bg-[#0f1b35]/80 backdrop-blur-md w-full h-[80px] flex items-center justify-between px-6 relative z-10 border-b border-white/5 shadow-lg">
        <img src={BannerUni} className="h-12 w-auto object-contain" alt="UTCC Banner"/>
        <div className="flex items-center space-x-2 text-slate-400">
          <BookOpen className="w-5 h-5 text-blue-500" />
          <span className="font-semibold tracking-wide text-sm">UTCC Bookstore</span>
        </div>
      </nav>

      {/* Centered Login Card */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 md:p-10 transition-all duration-300">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              เข้าสู่ระบบ
            </h1>
            <div className="flex items-center justify-center gap-2 mt-3 text-slate-400 text-sm">
              <span>ซื้อขายหนังสือเรียน</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Book University</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Student ID Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="studentId" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                รหัสนักศึกษา
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <input 
                  className="bg-white/5 w-full pl-12 pr-4 py-3 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 shadow-inner"
                  id="studentId"
                  name="studentId"
                  type="text"
                  placeholder="กรอกรหัสนักศึกษา..."
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  รหัสผ่าน
                </label>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <input 
                  className="bg-white/5 w-full pl-12 pr-4 py-3 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 shadow-inner"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="กรอกรหัสผ่าน..."
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-3 font-medium text-center">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 w-full rounded-xl font-bold transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-98 hover:scale-[1.01] flex items-center justify-center"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "ยืนยัน"
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default LoginPage;
