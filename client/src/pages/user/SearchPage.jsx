import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '../../util/axios.js'

import { Link } from 'react-router-dom';
import Promote from "/src/assets/Promote.png";
import Navdar from "./components/Navdar";
import Head from "./components/Head";

const SearchPage = () => {


    const navigate = useNavigate();
    const location =  useLocation()
    const [studentId, setStudentId] = useState("");
    const [userId, setUserId] = useState(null);
    const [books, setBooks] = useState([]);

    const query = new URLSearchParams(location.search)
    const searchKeyword = query.get("book") || "";
 
    useEffect(() => {

      const checkAuth = async () => {
      try {

        const res = await axios.get('/auth/protected', {withCredentials: true})
        setStudentId(res.data.user.studentId)
        setUserId(res.data.user.id)

      } catch (error) {
        console.error("User not authenticated", error);
        navigate("/"); // ถ้าไม่มี Token ให้กลับไปหน้า Login
      }
    }

    checkAuth()

  },[navigate])

  useEffect(() => {

    const searchBooks = async () => {
      try {
        const res = await axios.get(`/search-books?book=${searchKeyword}`, {withCredentials: true})

        setBooks(res.data.books)

      } catch (error) {
        console.error("Error fetching books", error)
      }
    }

    if(searchKeyword) {
      
      searchBooks();

    }

  },[searchKeyword])

    return (
        <div className="bg-[#F5F5F5] min-h-screen pb-10">
            
            <Head studentId={studentId}/>
            <Navdar/>
      
            <div className="pt-20">
            <img className='w-full' src={Promote}/> {/*รูปหนังสืออันใหญ่*/}
      
            <div className="container mx-auto px-4 md:px-8 mt-10">
              <h1 className='m-4 text-2xl font-semibold'>
                ผลการค้นหา: <span className='text-orange-600'>{searchKeyword}</span>
              </h1>
              {books.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 gap-y-10">
                  {books.map((book) => (
                    <Link to={`/user/DetailsPage/${book.id}`} key={book.id} className="flex justify-center">
                      <div className="w-72 bg-white hover:bg-gray-200 border border-gray-100 rounded-lg shadow overflow-hidden">
                        <div className="flex justify-center items-center py-4">
                          <img className="w-2/4 h-auto" src={`http://localhost:5001/${book.bookPic}`} alt="หนังสือ" />
                        </div>
                        <div className="p-5">
      
                          <h2 className="mb-2 text-lg font-bold text-gray-900 truncate">
                            {book.titleBook} 
                          </h2>
      
                          <h5 className="mb-2 text-l font-bold text-gray-900">
                            รายละเอียด : {book.description}
                          </h5>
      
                          <p className="mb-3 font-bold text-xl text-gray-700">{book.price} ฿ </p>
      
                        </div>
                      </div>
                    </Link>
                  ))}
                
              </div>
              ): (
                <p className='m-4 text-2xl font-semibold text-yellow-600'>ไม่พบผลการค้นหา</p>
              )}
            </div>
          </div>
          </div>
      
        );
}

export default SearchPage
