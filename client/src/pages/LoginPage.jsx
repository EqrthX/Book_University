import { useState } from "react"
import BannerUni from "../assets/Banner.png"
import BGUni from "../assets/bg.jpeg"
import { Link, useNavigate } from "react-router-dom"
import axios from "../util/axios.js"
import toast from "react-hot-toast"

const LoginPage = () => {

  const [values, setValues] = useState({
    studentId: "",
    password: ""
  }) 

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    setValues({...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true)
    setErrorMessage("")

    if(!values.studentId || !values.password) {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบ")
      setIsLoading(false)
      return;
    }

    try {
      const res = await axios.post("/auth/login", values, {
        withCredentials: true
      });

      console.log("Response from server:", res.data); // ✅ Debug response

      const getRole = res.data.user.user_role;

      if(getRole === "admin") {
        navigate('/admin/AdminHomepage')
      } else if(getRole === "student") {
        navigate('/user/Homepage')
      } else {
        setErrorMessage("ไม่พบสิทธิ์ของผู้ใช้บัญชีนี้")
      }
      
      toast.success("เข้าสู่ระบบ")

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
    <div 
        className={`w-full h-screen bg-cover bg-center relative overflow-hidden`}
    >
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${BGUni})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: '15%'
        }}
      />

      <nav className="bg-[#2E3192] w-full h-[80px] flex items-center relative z-10">
              <img src={BannerUni} className="h-full w-auto object-contain"/>
      </nav>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
        <h1 className="text-3xl font-bold mb-3">เข้าสู่ระบบ</h1>

        <div className="flex items-center justify-center gap-2 py-2">
            <h3 className="text-sm font-bold" style={{ fontFamily: 'Superstore, sans-serif' }}>
                ซื้อขายหนังสือ
            </h3>
              <p className="w-0.5 h-[20px] bg-black" />
            <h3 className="text-sm font-bold" style={{ fontFamily: 'Superstore, sans-serif' }}>
                Bookstore
            </h3>
          </div>

        <form 
          onSubmit={handleSubmit}
        className="mt-5 flex flex-col items-center gap-4 w-full">

              <div className="flex justify-between w-full items-center" >
              
                <span className="w-[120px] text-left font-semibold">รหัสนักศึกษา</span>
                <input 
                  className="bg-white w-[220px] px-2 py-1 border border-blue-800 "
                  id="studentId"
                  name="studentId"
                  type="text"
                  onChange={handleChange}
                  required
                />

              </div>
              <div className="flex justify-between w-full items-center">
              
                <span className="w-[120px] text-left font-semibold">รหัสผ่าน</span>
                <input 
                  className="bg-white w-[220px] px-2 py-1 border border-blue-800 "
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  required
                  />

              </div>

              {errorMessage && <p className="text-red-500 text-lg font-semibold">{errorMessage}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#2E3192] text-white px-3 py-3 w-[220px] rounded-lg font-semibold transition-colors hover:bg-blue-600"
              >
                ยืนยัน
              </button>
        </form>

      </div>

    </div>
  )
}

export default LoginPage
