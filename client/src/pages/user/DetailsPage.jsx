import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../util/axios.js'

import Navdar from "./components/Navdar";
import Head from "./components/Head";
import { Book , MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';

const DetailsPage = () => {

    const navigate = useNavigate();
    const [studentId, setStudentId] = useState("");
    const {id} = useParams();
    const [book, setBook] = useState([]);

    useEffect(() => {
          const checkAuth = async () => {
          try {
              const res = await axios.get('/auth/protected', {withCredentials: true})
              setStudentId(res.data.user.studentId)
          } catch (error) {
              console.error("User not authenticated", error);
              navigate("/"); // ถ้าไม่มี Token ให้กลับไปหน้า Login
          }
          }

          checkAuth()
      },[navigate])

    useEffect(() => {
      const fetchOnceBook = async () => {
        try {
          const res = await axios.get(`/show-once-book/${id}`, {withCredentials: true})
          setBook(res.data.book)
          console.log(book);
        } catch (error) {
          console.error("Error fetching once book", error)
        }
      }

      fetchOnceBook();
    }, [id])
    
    
    const addToCart = async(id) => {
      try {
        const res = await axios.post(`/add-to-cart/${id}`, {withCredentials: true})

        if(res.status === 201) {
          toast.success("Added to cart")
          navigate("/user/HomePage")
        }
      } catch (error) {
        console.error("Error adding to cart", error)
        toast.error("Error adding to cart")
      }
    }

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-10">
      <Head studentId={studentId}/>
      <Navdar />
      

      <div className="pt-25 ">
      {/* icon รายละเอียด */}
        <div className="flex flex-col items-start px-6 md:px-10 ml-15">
          <div className="flex items-center mb-4">
            <div className="text-[#2d3695] py-5">
              <Book className="w-10 h-10" />
            </div>
            <h1 className="font-bold text-2xl ml-3">รายละเอียด</h1>
          </div>
        </div>

        {/* กรอบสีขาว */}
        <div className="flex justify-center px-4 md:px-10">
          <div className="w-full max-w-5xl bg-white flex flex-col rounded-2xl shadow-lg p-6">

            <div className="flex flex-col md:flex-row items-center md:items-start justify-between space-y-6 md:space-y-0">
                {/* รูปหนังสือ */}
                <div className="w-full md:w-1/3 flex justify-center">
                  <img 
                    className="w-48 h-64 md:w-60 md:h-80 object-cover rounded-lg mt-10" 
                    src={book.bookPic ? `http://localhost:5001/${book.bookPic.replace(/\\/g, "/")}` : "URL_TO_DEFAULT_IMAGE"} 
                    alt={book.titleBook || "ชื่อหนังสือ"} />
                </div>

                {/* ข้อมูลหนังสือ */}
                <div className="w-full md:w-1/3 text-center md:text-left mt-30">
                  <h1 className="text-xl font-bold truncate ">{book.titleBook || "ไม่มีชื่อหนังสือ"}</h1>
                  <p className="text-black break-words whitespace-normal mt-2">
                    รายละเอียดหนังสือ : {book.description || "ไม่มีรายละเอียด"}
                  </p>

                  <p className="text-black text-sm mt-2">รหัสวิชา: {book.subjectCode}</p>
                </div>

                {/* กรอบสีเหลืองนัดรับได้ */}
                <div className="w-full md:w-1/3 flex flex-col items-center md:items-end space-y-3 mt-5">
                  {book.canMeet === "yes" ? (
                    <div className="bg-[#F8E94C] text-black px-4 py-2 ">
                      นัดรับได้
                    </div>
                  ) : (
                    <div className="bg-[#D93619] text-white  font-bold px-4 py-2 ">
                      นัดรับไม่ได้
                    </div>
                  )}

                  {/* ปุ่มไปแชท */}
                  <button className="bg-[#3986DD] text-white px-4 py-2 rounded-md flex items-center space-x-2 mt-3 ">
                      <MessageSquareText />
                      <span>ส่งข้อความ</span>
                    </button>
                </div>

 

                {/* ราคา */}
                <div className="text-2xl font-bold text-black mt-70 mr-5">{book.price}฿</div>
            </div>

            {/* ปุ่ม */}
            <div className="flex flex-col md:flex-row justify-center md:justify-end mt-6 space-y-3 md:space-y-0 md:space-x-4">
              <button 
                onClick={() => addToCart(book.id)}
                className="bg-[#358C1B] text-white px-6 py-2 rounded-md w-full transition-colors hover:bg-green-700 md:w-auto"
                >
                เพิ่มตะกร้า
              </button>
              <Link to={`/user/BuyNowPage/`} className="bg-[#D93619] text-white px-6 py-2 rounded-md w-full transition-colors hover:bg-red-700 md:w-auto">
                  ซื้อหนังสือ
              </Link>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
