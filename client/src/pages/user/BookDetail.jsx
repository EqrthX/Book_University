import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../util/axios.js'
import Head from './components/Head.jsx';
import Navdar from './components/Navdar.jsx';

const BookDetail = () => {

    const navigate = useNavigate();
    const [user, setUser] = useState({
        userId: "",
        studentId: "",
    });
    const {id} = useParams();
    const [book, setBook] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
      
              const res = await axios.get('/auth/protected', {withCredentials: true})
              setUser({
                userId: res.data.user.id,
                studentId: res.data.user.studentId,
              })
      
              const resOnceBook = await axios.get(`/show-history-book/${id}`, {withCredentials: true})
              console.log(resOnceBook.data.history);
              setBook(resOnceBook.data.history)
              
            } catch (error) {
      
              console.error("User not authenticated", error);
              navigate("/"); // ถ้าไม่มี Token ให้กลับไปหน้า Login
      
            } finally {
              setLoading(false)
            }
          }
      
          checkAuth()
    },[navigate])

    const statusSteps = [
        { key: "pending", label: "รอดำเนินการ" },
        { key: "waiting_delivery", label: "กำลังรอจัดส่งสินค้า" },
        { key: "shipped", label: "จัดส่งแล้ว" },
        { key: "delivered", label: "ส่งสินค้าเรียบร้อย" },
    ]
  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-10">
        <Head studentId={user.studentId}/>
        <Navdar />

        <div className='container mx-auto px-6 md:px-30 pt-35'>

            <div className='w-full bg-white rounded-lg shadow-md p-6 h-auto flex'>

                <div className='w-1/2 flex justify-center items-center flex-col'>
                    <h1 className='text-lg font-semibold text-center mb-4'>รายละเอียดหนังสือ</h1>
                    <h1 className='text-lg font-semibold text-center mb-4'>ชื่อหนังสือ {book.titleBook}</h1>
                    <h1 className='text-lg font-semibold text-center mb-4'>ราคา {book.price} บาท</h1>
                    <img className="w-50 h-70 mr-4 shadow-2xl" src={`http://localhost:5001/${book.bookPic}`} alt="หนังสือ" />
                </div>

                <div className="w-1/2 flex mt-auto mb-auto">
                    <ul className="timeline timeline-vertical">
                        {statusSteps.map((step, index) => {
                        // คำนวณ index ของสถานะปัจจุบัน
                        const currentStatusIndex = statusSteps.findIndex(s => s.key === book.delivery_status);
                        return (
                            <li key={index} className="flex items-center">
                            <div
                                className={`timeline-start m-5 text-xl ${
                                index <= currentStatusIndex ? 'text-green-500' : 'text-gray-400'
                                }`}
                            >
                                {index + 1}
                            </div>

                            <div className="timeline-middle">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className={`h-10 w-10 ${
                                    index <= currentStatusIndex ? 'text-green-500' : 'text-gray-400'
                                }`}
                                >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                    clipRule="evenodd"
                                />
                                </svg>
                            </div>

                            <div
                                className={`timeline-end timeline-box text-xl m-5 bg-indigo-200 shadow-lg rounded-lg ${
                                index <= currentStatusIndex ? 'text-green-500' : 'text-black'
                                }`}
                            >
                                {step.label}
                            </div>
                            {index < statusSteps.length - 1 && <hr />}
                            </li>
                        );
                        })}
                    </ul>
               </div>

            </div>

        </div>
    </div>
  )
}

export default BookDetail
