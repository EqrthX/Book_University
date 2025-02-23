import { useState } from "react"
import BannerUni from "../assets/Banner.png"
import BGUni from "../assets/bg.jpeg"
import { Link, useNavigate } from "react-router-dom"
import axios from "../util/axios.js"
import toast from "react-hot-toast"

const SignupPage = () => {

    const [values, setValues] = useState({
        studentId: "",
        fullName: "",
        email: "",
        password: ""
    })
    
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const navigate = useNavigate()

    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        setErrorMessage("")

        if(!values.studentId || !values.fullName || !values.email || !values.password) {
          setErrorMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง")
          setIsLoading(false)
          return
        }

        try {

          const res = await axios.post("/auth/signup", values);

          if(res.status === 201 || res.status === 200) {
            
            toast.success("Sign Up Successfully");
            navigate("/login");
            
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
            <h1 className="text-3xl font-bold mb-3">สมัครสมาชิก</h1>
    
            <div className="w-2/3 h-[5px] bg-black mx-auto mb-3"/>
    
            <h3 className="text-lg font-bold">ซื้อขายหนังสือ</h3>
            {errorMessage && <p className="text-lg text-red-600 font-semibold mt-3">{errorMessage}</p>}
            <form 
                onSubmit={handleSubmit}
                className="mt-5 flex flex-col items-center gap-4 w-full">
    
                  <div className="flex justify-between w-full items-center" >
                  
                    <span className="w-[120px] text-left font-semibold">รหัสนักศึกษา</span>
                    <input 
                      className="bg-white w-[220px] px-2 py-1 border border-blue-800 "
                      id="studentId"
                      name="studentId"
                      value={values.studentId}
                      type="text"
                      onChange={handleChanges}
                    />
    
                  </div>

                  <div className="flex justify-between w-full items-center" >
                  
                    <span className="w-[150px] text-left font-semibold">ชื่อจริง - นามสกุล</span>
                    <input 
                      className="bg-white w-[220px] px-2 py-1 border border-blue-800 "
                      id="fullName"
                      name="fullName"
                      value={values.fullName}
                      type="text"
                      onChange={handleChanges}

                    />
    
                  </div>

                  <div className="flex justify-between w-full items-center" >
                  
                    <span className="w-[120px] text-left font-semibold">อีเมล</span>
                    <input 
                      className="bg-white w-[220px] px-2 py-1 border border-blue-800 "
                      id="email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChanges}

                    />
    
                  </div>

                  <div className="flex justify-between w-full items-center">
                  
                    <span className="w-[120px] text-left font-semibold">รหัสผ่าน</span>
                    <input 
                      className="bg-white w-[220px] px-2 py-1 border border-blue-800 "
                      id="password"
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChanges}
                      />
    
                  </div>

                  <span className="text-lg font-semibold">คุณมีบัญชีอยู่แล้ว {" "} <Link to="/login" className="transition-all hover:text-blue-600 top-0 left-0 right-0 hover:border-b-4 hover:border-blue-600">Login</Link> </span>
    
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={` bg-[#2E3192] text-white px-3 py-3 w-[220px] rounded-lg font-semibold transition-colors hover:bg-blue-600 `}
                  >
                    ยืนยัน
                  </button>
            </form>
    
          </div>
    
        </div>
  )
}

export default SignupPage
