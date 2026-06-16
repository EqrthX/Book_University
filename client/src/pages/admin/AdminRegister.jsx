import React, { useState } from 'react';
import axios from '../../util/axios.js';
import toast from 'react-hot-toast';
import { User, Mail, Lock, UserPlus, FileText } from "lucide-react";

const AdminRegister = () => {
  const [values, setValues] = useState({
    studentId: "",
    email: "",
    fullName: "",
    password: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChanges = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    
    if(!values.studentId || !values.email || !values.fullName || !values.password) {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      setIsLoading(false);
      return;
    }

    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!regex.test(values.email)) {
      toast.error("กรุณากรอกอีเมลให้ถูกต้อง");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post("/auth/signup", values);
      if(res.status === 201 || res.status === 200) {
        toast.success("ลงทะเบียนนักศึกษาใหม่สำเร็จ");
        setValues({
          studentId: "",
          email: "",
          fullName: "",
          password: ""
        });
      } else {
        setErrorMessage(res.data.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
      }
    } catch (error) {
      if(error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        console.error("Register Error: ", error);
        setErrorMessage(error.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full font-sans text-slate-800'>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-5 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">ลงทะเบียนนักศึกษาใหม่</h1>
          <p className="text-sm text-slate-500 mt-1">สร้างบัญชีนักศึกษาเข้าระบบการซื้อขายหนังสือ</p>
        </div>
      </div>

      {/* Form Card Container */}
      <div className='flex justify-start items-center w-full max-w-2xl bg-slate-50/50 border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm'>
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-5'>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Student ID */}
            <div className='flex flex-col gap-1.5'>
              <label className='font-bold text-xs uppercase tracking-wider text-slate-500'>รหัสนักศึกษา</label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input 
                  className='bg-white w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-inner'
                  type='text'
                  placeholder='22xxxxxx...'
                  name='studentId'
                  value={values.studentId}
                  onChange={handleChanges}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className='flex flex-col gap-1.5'>
              <label className='font-bold text-xs uppercase tracking-wider text-slate-500'>อีเมลมหาวิทยาลัย</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input 
                  className='bg-white w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-inner'
                  type='text'
                  placeholder='name@live4.utcc.ac.th'
                  name='email'
                  value={values.email}
                  onChange={handleChanges}
                  required
                />
              </div>
            </div>

            {/* Full Name */}
            <div className='flex flex-col gap-1.5'>
              <label className='font-bold text-xs uppercase tracking-wider text-slate-500'>ชื่อ - นามสกุล</label>
              <div className="relative flex items-center">
                <FileText className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input 
                  className='bg-white w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-inner'
                  type='text'
                  placeholder='ชื่อ จริง และนามสกุล...'
                  name='fullName'
                  value={values.fullName}
                  onChange={handleChanges}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className='flex flex-col gap-1.5'>
              <label className='font-bold text-xs uppercase tracking-wider text-slate-500'>รหัสผ่านเริ่มต้น</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input 
                  className='bg-white w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-inner'
                  type='password'
                  placeholder='ระบุรหัสผ่านเริ่มต้น...'
                  name='password'
                  value={values.password}
                  onChange={handleChanges}
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl p-3 font-medium text-center mt-2">
              {errorMessage}
            </div>
          )}

          {/* Submit */}
          <div className='flex justify-end mt-2'>
            <button 
              type='submit'
              disabled={isLoading}
              className='bg-[#05998A] hover:bg-[#047D71] w-full sm:w-48 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-md shadow-teal-500/15 active:scale-95 flex items-center justify-center space-x-1.5'
            >
              <UserPlus className="w-4 h-4" />
              {isLoading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <span>เพิ่มรายชื่อนักศึกษา</span>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default AdminRegister;
