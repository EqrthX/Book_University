import React, { useState } from 'react'
import axios from '../../util/axios.js'
import toast from 'react-hot-toast';
const AdminCheckBooks = () => {

  const [values, setValues] = useState({
    studentId: "",
    email: "",
    fullName: "",
    password: ""
  })


  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [emailError, setEmailError] = useState("")

  const handleChanges = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    setErrorMessage("")
    setEmailError("")
    
    if(!values.studentId || !values.email || !values.fullName || !values.password) {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบ");
      setIsLoading(false);
      return;
    }

    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    if(!regex.test(values.email)) {
      toast.error("กรูณากรอกอีเมลให้ถูกต้อง")
      setIsLoading(false);
      return;
    }

    try {

      const res = await axios.post("/auth/signup", values)

      if(res.status === 201 || res.status === 200) {

        toast.success("ลงทะเบียนสำเร็จ")
        setValues({
          studentId: "",
          email: "",
          fullName: "",
          password: ""
        })

      } else {

        setErrorMessage(res.data.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก")

      }
    } catch (error) {

      if(error.response && error.response.status === 400) {
            
        toast.error(error.response.data.message)
      
      } else {
        
        console.error("Sign Up Page error: ", error);
        setErrorMessage(error.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่")
      }
      
    } finally {

      setIsLoading(false)

    }

  }

  return (
    <div className='w-full min-h-screen '>
        
      <h3 className='font-semibold text-3xl mb-6 mt-6'>ตรวจสอบหนังสือ</h3>
      
      {/* แสดงรายการยืนยันหนังสือ */}
      <div className='relative mx-auto grid grid-cols-5 gap-6 w-full max-h-screen justify-center'>
          
          <div className='flex flex-col w-56'>
            <img className='border-4 p-12 h-40 rounded-2xl'/>
            <p className='mt-5 mb-5 font-semibold'>ชื่อหนังสือ</p>
            <p className='mt-5 mb-5 font-semibold'>รา่ยละเอียด</p>
            <button className='p-2 bg-[#D3E92E] rounded-xl mb-5 transition-all hover:bg-emerald-400 hover:text-white'>
              ยืนยัน
            </button>
            <button className='p-2 bg-[#EB0000] rounded-xl mb-5 transition-all hover:bg-orange-400 hover:text-white'>
              ยกเลิก
            </button>
          </div>

          <div className='flex flex-col w-56'>
            <img className='border-4 p-12 h-40 rounded-2xl'/>
            <p className='mt-5 mb-5 font-semibold'>ชื่อหนังสือ</p>
            <p className='mt-5 mb-5 font-semibold'>รา่ยละเอียด</p>
            <button className='p-2 bg-[#D3E92E] rounded-xl mb-5 transition-all hover:bg-emerald-400 hover:text-white'>
              ยืนยัน
            </button>
            <button className='p-2 bg-[#EB0000] rounded-xl mb-5 transition-all hover:bg-orange-400 hover:text-white'>
              ยกเลิก
            </button>
          </div>

          <div className='flex flex-col w-56'>
            <img className='border-4 p-12 h-40 rounded-2xl'/>
            <p className='mt-5 mb-5 font-semibold'>ชื่อหนังสือ</p>
            <p className='mt-5 mb-5 font-semibold'>รา่ยละเอียด</p>
            <button className='p-2 bg-[#D3E92E] rounded-xl mb-5 transition-all hover:bg-emerald-400 hover:text-white'>
              ยืนยัน
            </button>
            <button className='p-2 bg-[#EB0000] rounded-xl mb-5 transition-all hover:bg-orange-400 hover:text-white'>
              ยกเลิก
            </button>
          </div>

          <div className='flex flex-col w-56'>
            <img className='border-4 p-12 h-40 rounded-2xl'/>
            <p className='mt-5 mb-5 font-semibold'>ชื่อหนังสือ</p>
            <p className='mt-5 mb-5 font-semibold'>รา่ยละเอียด</p>
            <button className='p-2 bg-[#D3E92E] rounded-xl mb-5 transition-all hover:bg-emerald-400 hover:text-white'>
              ยืนยัน
            </button>
            <button className='p-2 bg-[#EB0000] rounded-xl mb-5 transition-all hover:bg-orange-400 hover:text-white'>
              ยกเลิก
            </button>
          </div>

          <div className='flex flex-col w-56'>
            <img className='border-4 p-12 h-40 rounded-2xl'/>
            <p className='mt-5 mb-5 font-semibold'>ชื่อหนังสือ</p>
            <p className='mt-5 mb-5 font-semibold'>รา่ยละเอียด</p>
            <button className='p-2 bg-[#D3E92E] rounded-xl mb-5 transition-all hover:bg-emerald-400 hover:text-white'>
              ยืนยัน
            </button>
            <button className='p-2 bg-[#EB0000] rounded-xl mb-5 transition-all hover:bg-orange-400 hover:text-white'>
              ยกเลิก
            </button>
          </div>

      </div>


    </div>
  )
}

export default AdminCheckBooks
