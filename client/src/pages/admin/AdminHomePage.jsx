import axios from '../../util/axios.js'
import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import UTCC from '../../assets/UTCC.png'


const AdminHomePage = () => {
  
  const navigate = useNavigate();
  const [userName, setUserName] = useState("")

  useEffect(() => {
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
  }, [navigate])

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

      <div className='w-[15%] bg-[#D9D143] p-5 h-screen flex justify-evenly text-center flex-col'>
        <ul>

          <li className='border-b-4 border-white py-5 px-5'>
            <Link to="register" className='font-semibold hover:text-pink-600'>ลงทะเบียนนักศึกษา</Link>
          </li>

          <li className='border-b-4 border-white py-5 px-5'>
            <Link to="check-books" className='font-semibold hover:text-pink-600'>ตรวจสอบหนังสือ</Link>
          </li>

          <li className='border-b-4 border-white py-5 px-5'>
            <Link to="check-payment" className='font-semibold hover:text-pink-600'>ตรวจสอบชำระเงิน</Link>
          </li>

        </ul>
        <button
          onClick={handleLogout} 
          className='p-4 bg-red-500 text-white rounded-xl transition-colors hover:bg-red-700'>Logout</button>
      </div>

      {/* Navbar and main content */}
      
      <div className='w-[85%] h-screen bg-gray-100 p-5 overflow-auto'>
        
        <nav className='bg-[#D9D14378] w-full h-[80px] flex justify-between items-center px-10'>
          <img src={UTCC} className="h-full w-auto object-contain"/>
          <h3 className='text-xl font-semibold'>{userName}</h3>
        </nav>

        {/* แสดงเนื้อตาม route ภายใน admin */}
        <div>

          <Outlet/>

        </div>


      </div>

      

    </div>
  )
}

export default AdminHomePage
