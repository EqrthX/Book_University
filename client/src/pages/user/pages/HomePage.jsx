import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../../util/axios.js'

import Promote from "/src/assets/Promote.png";
import Navdar from "../../../components/user/Navdar.jsx";
import Head from "../../../components/user/Head.jsx";
import BookCard from "../../../features/books/components/BookCard.jsx";

const HomePage = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/auth/protected', { withCredentials: true })
        setStudentId(res.data.user.studentId)
      } catch (error) {
        console.error("User not authenticated", error);
        navigate("/");
      }
    }

    checkAuth()
  }, [navigate])

  useEffect(() => {
    const getAllBooks = async () => {
      try {
        const res = await axios.get('/product/show-books', { withCredentials: true })
        setBooks(res.data.books)
      } catch (error) {
        console.error("Error fetching books", error)
      }
    }

    getAllBooks();
  }, [])

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-10">
      <Head studentId={studentId} />
      <Navdar />

      <div className="pt-20">
        <img className='w-full' src={Promote} alt="promotion" />

        <div className="container mx-auto px-4 md:px-8 mt-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 gap-y-10">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
