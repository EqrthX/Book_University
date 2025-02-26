import axios from '../../util/axios.js'
import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import UTCC from '../../assets/UTCC.png'

import HeadAdmin from './components/HeadAdmin.jsx'


const AdminHomePage = () => {
  
  const navigate = useNavigate();
  const [userName, setUserName] = useState("")

  /*useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/auth/protected', {withCredentials: true})
        setUserName(res.data.user.studentId)
      } catch (error) {
        console.error("User not authenticated", error);
        navigate("/login"); // ถ้าไม่มี Token ให้กลับไปหน้า Login
      }
    }

    checkAuth()
  }, [navigate])*/

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", {}, {withCredentials: true})
      navigate("/login")
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  }

  return (
    <div className='w-full min-h-screen flex font-[Superstore]'>

      {/* Sidebar */}

      <div className='w-[15%] bg-[#163D76] p-5 h-screen flex justify-evenly text-left flex-col'>
        <ul className='mt-40'>
          <li className='py-5 px-5'>
            <Link to="register" className='font-semibold text-white hover:text-pink-600'>ลงทะเบียนนักศึกษา</Link>
          </li>

          <li className='py-5 px-5'>
            <Link to="check-books" className='font-semibold text-white hover:text-pink-600'>ตรวจสอบหนังสือ</Link>
          </li>

          <li className='py-5 px-5'>
            <Link to="check-payment" className='font-semibold text-white hover:text-pink-600'>ตรวจสอบชำระเงิน</Link>
          </li>

        </ul>
        
        <div className='flex flex-col mt-auto'>
          <div className="flex items-center justify-center gap-2 py-2   bg-white rounded-sm" style={{ fontFamily: 'Superstore, sans-serif' }}>
            <h3 className="text-sm font-bold">admin</h3>
            <p className="w-0.5 h-[20px] bg-black" />
            <h3 className="text-sm font-bold">101</h3>
          </div>
          <button
          onClick={handleLogout} 
          className="flex items-center justify-center gap-2 py-2 mt-4 text-white bg-red-600 rounded-sm "style={{ fontFamily: 'Superstore, sans-serif' }}>
            Logout</button>
        </div>
      </div>

      {/* Navbar and main content */}
      
      <div className='w-[85%] h-screen bg-gray-100 p-5 overflow-auto'>
        
      <HeadAdmin/>
        {/* แสดงเนื้อตาม route ภายใน admin */}
        <div>

          <Outlet/>

        </div>


      </div>

      

    </div>
  )
}

export default AdminHomePage