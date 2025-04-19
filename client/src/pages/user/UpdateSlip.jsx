import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../util/axios.js'
import Head from './components/Head.jsx'
import Navbar from "./components/Navdar.jsx";
import { FileDown, X } from 'lucide-react';
import toast from 'react-hot-toast';


const UpdateSlip = () => {

    const {id} = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState({
        userId: "",
        studentId: ""
    })

    const [values, setValues] = useState({
        payment_date: "",
        payment_time: "",
        slip_image: null,
    })

    const [selectedFile, setSelectedFile] = useState(null)

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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setSelectedFile(URL.createObjectURL(file))
            setValues((prev) => ({
                ...prev,
                slip_image: file
            }))
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target

        setValues((prev) => ({
            ...prev,
            [name] : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData()

        formData.append("payment_date", values.payment_date)
        formData.append("payment_time", values.payment_time)

        if(values.slip_image) {
            
            formData.append("paymentSlip", values.slip_image)
        
        } else {

            toast.waring("กรุณาใส่รูปภาพ")
            return;
        }

        const resUpdate = await axios.put(`/payment/edit-payment/${id}`, formData, {
            withCredentials: true,
            headers: {
                "Content-Type" : "multipart/form-data"
            }
        })

        if(resUpdate.status === 200) {
            navigate("/user/HomePage")
        }

    }

    return (
        <div className="bg-[#F5F5F5] min-h-screen pb-10 overflow-x-auto overflow-y-auto">
            <Head studentId={user.studentId}/>
            <Navbar />
            
            <div className='container w-full h-auto flex flex-col justify-center items-center overflow-x-auto '>
                <div className="w-full h-auto flex justify-center items-start pt-10 mt-30 overflow-y-auto">
                    <div className="flex flex-row gap-70 ">
                        
                        {/* ซ้าย: เลือกรูป */}
                        <div className="w-1/2 h-auto flex flex-col items-center">
                            <div className="w-64 h-80 border-2 border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center">
                                {!selectedFile && (
                                    <>
                                        <FileDown className="w-10 h-10 text-gray-500" />
                                        <label className="mt-3 px-4 py-2 border-2 border-gray-500 rounded-lg text-gray-500 cursor-pointer">
                                            เพิ่มรูป
                                            <input 
                                            className="hidden" 
                                            type="file" 
                                            accept="image/jpeg, image/png"
                                            onChange={handleFileChange}
                                            />

                                        </label>
                                        
                                    </>
                                )}

                                {selectedFile && (
                                    <>
                                        <div className="relative w-full h-full">
                                            <img src={selectedFile} alt="slip payment" className="w-full h-full object-contain" />
                                            <X 
                                                onClick={() => setSelectedFile(null)}
                                                color="red"
                                                size={32}
                                                className="absolute top-2 right-2 cursor-pointer bg-white rounded-full"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                                <h5 className="text-sm text-red-500 mt-2">* JPEG, PNG</h5>
                            </div>

                            {/* ขวา: วันและเวลาโอน */}
                            <div className="w-1/2 h-auto flex flex-col justify-center">
                                <label className="text-lg">วัน/เดือน/ปี ที่โอนเงิน</label>
                                <div className="flex space-x-2 mt-2">
                                    <input 
                                    type="date" 
                                    className="border p-2 rounded-sm w-60 text-center text-gray-500 hover:text-black" 
                                    name='payment_date'
                                    onChange={handleChange}
                                    value={values.payment_date}
                                    />
                                </div>

                                <label className="text-lg mt-4">เวลาโอนเงิน</label>
                                <div className="flex space-x-2 mt-2">
                                    <input 
                                    type="time" 
                                    className="border p-2 rounded-sm w-35 text-center text-gray-500 hover:text-black"  
                                    name='payment_time'
                                    onChange={handleChange}
                                    value={values.payment_time}
                                    />
                                </div>
                            </div>
                        </div>
                            
                    </div>                
                    <button 
                        className='w-2xl p-3.5 bg-blue-700 rounded-lg text-white mt-5 cursor-pointer transition-colors hover:bg-blue-400'
                        onClick={handleSubmit}
                    >
                        ส่งสลิปใหม่
                    </button>
            </div>

        </div>
    )
}

export default UpdateSlip
