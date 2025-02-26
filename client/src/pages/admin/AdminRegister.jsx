import React, { useState } from 'react'
import axios from '../../util/axios.js'
import toast from 'react-hot-toast';

const AdminRegister = () => {

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
    <div className='w-full h-screen overflow-hidden'>
        
            <h3 className='font-semibold text-3xl mb-6 mt-6'>ลงทะเบียนนักศึกษา</h3>
            
            <div className='flex justify-center items-center w-full'>
                <form 
                  onSubmit={handleSubmit}
                  className='w-[50%] bg-white shadow-xl p-6 rounded-lg flex flex-col'>
                    
                        <div className='mb-4 p-4 flex justify-around gap-2 items-center'>
                            <label className='font-semibold w-[150px]'>รหัสนักศึกษา</label>
                            <input 
                              className='bg-gray-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                              type='text'
                              placeholder='22...'
                              name='studentId'
                              value={values.studentId}
                              onChange={handleChanges}
                            />
                        </div>

                        <div className='mb-4 p-4 flex justify-around gap-2 items-center'>
                            <label className='font-semibold w-[150px]'>อีเมล</label>
                            <input 
                              className='bg-gray-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                              type='text'
                              placeholder='example@email.com'
                              name='email'
                              value={values.email}
                              onChange={handleChanges}
                            />
                            
                        </div>

                        <div className='mb-4 p-4 flex justify-around gap-2 items-center'>
                            <label className='font-semibold w-[150px]'>ชื่อ-นามสกุล</label>
                            <input 
                              className='bg-gray-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                              type='text'
                              placeholder='A B'
                              name='fullName'
                              value={values.fullName}
                              onChange={handleChanges}
                            />
                        </div>

                        <div className='mb-4 p-4 flex justify-around gap-2 items-center'>
                            <label className='font-semibold w-[150px]'>รหัสผ่าน</label>
                            <input 
                              className=' bg-gray-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                              type='password'
                              placeholder='xxxxx'
                              name='password'
                              value={values.password}
                              onChange={handleChanges}
                            />
                        </div>
                        
                        <div className='flex justify-center'>
                            
                            <button 
                              type='submit'
                              disabled={isLoading}
                              className='bg-[#05998A] w-60 p-3 rounded-xl text-white font-semibold transition-colors hover:bg-green-500'>
                                เพิ่มรายชื่อ
                            </button>

                        </div>
                </form>

            </div>


    </div>
  )
}

export default AdminRegister
