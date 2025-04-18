import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../util/axios.js'
import Head from './components/Head.jsx'
import Navbar from "./components/Navdar.jsx";
import { FileDown } from 'lucide-react';


const UpdateSlip = () => {

    const {id} = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState({
        userId: "",
        studentId: ""
    })

    useEffect(() => {
        const checkAuth = async () => {
          try {
              const res = await axios.get('/auth/protected', {withCredentials: true})
              
              console.log("Auth Response: ", res.data);
    
              setUser({
                  userId: res.data.user.id,
                  studentId: res.data.user.studentId
              })
    
          } catch (error) {
              console.error("User not authenticated", error);
              navigate("/"); // ถ้าไม่มี Token ให้กลับไปหน้า Login
          }
        }
    
          checkAuth()
      }, [navigate])

    return (
        <div className="bg-[#F5F5F5] min-h-screen pb-10 overflow-x-auto overflow-y-auto">
            <Head studentId={user.studentId}/>
            <Navbar />
            
            <div className='container min-w-screen h-auto flex justify-center items-center'>
                <div className='w-full h-auto mt-50'>
                    
                    <div className='w-1/2 h-auto overflow-x-auto overflow-y-auto flex mx-auto mt-auto'>
                        <div className="w-64 h-80 border-2 border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center">
                            <>
                                <FileDown className="w-10 h-10 text-gray-500" />
                                <label className="mt-3 px-4 py-2 border-2 border-gray-500 rounded-lg text-gray-500 cursor-pointer">
                                    เพิ่มรูป
                                    <input 
                                        className="hidden" 
                                        type="file" 
                                        accept="image/jpeg, image/png"
                                    />
                                </label>
                            </>

                        </div>
                    </div>

                    <div className='w-1/2 h-auto'>

                    </div>
                        
                </div>
            </div>
        </div>
    )
}

export default UpdateSlip
