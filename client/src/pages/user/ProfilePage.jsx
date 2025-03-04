import { useEffect, useState } from 'react';
import axios from '../../util/axios.js';
import { Link, useNavigate } from 'react-router-dom';
import Head from './components/Head.jsx';
import Navdar from './components/Navdar.jsx';
import toast from 'react-hot-toast';

const ProfilePage = () => {

  const [studentId, setStudentId] = useState("");
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const [id, setId] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get('/auth/protected', { withCredentials: true });
        setId(res.data.user.id);
        setStudentId(res.data.user.studentId);
        setProfile(res.data.user);
      } catch (error) {
        console.error("Error fetching user profile", error);
        navigate("/");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    const handleShowProductWithuser = async () => {

      if(!id) return;
      try {
        const res = await axios.get(`/show-for-user`,
          {userId: id}, 
          { withCredentials: true }
        );

        if (res.data.books.length === 0) {
          console.log("Books not found");
          toast.error("Books not found");
        } else {
          setBooks(res.data.books);
        }
      } catch (error) {
        console.error('Error fetching user product', error);
      }
    };

    if (id) {
      handleShowProductWithuser();
    }
  }, [id]);

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
      navigate('/');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  
  const deleteBook = async (bookId) => {
    const confirmDelete = window.confirm("ต้องการลบข้อมูลสินค้านี้ใช่ไหม");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`/delete-book`, { 
        data: { bookId },
        withCredentials: true 
      });

      if (res.status === 200) {
        toast.success("ลบสินค้าสำเร็จ");
        setBooks(books.filter(book => book.id !== bookId));
      }

    } catch (error) {
      console.error('Error deleting book', error);
    }
  }

  if (!studentId) {
    return <div className='text-5xl animate-bounce'>Loading...</div>;
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <Head studentId={studentId} />
      <Navdar />

      <div className="container mx-auto px-4 md:px-8 mt-10 flex flex-col justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          {profile && (
            <div>
              <p><strong>Student ID:</strong> {profile.studentId}</p>
              <p><strong>Email:</strong> {profile.email}</p>
            </div>
          )}
        </div>

        <div className='mt-3 bg-white p-6 rounded-lg shadow-md'>
          <h1 className='text-lg font-semibold text-center'>สินค้าที่ขาย</h1>
          
          <div>
            {books.map((book) => (

              <div key={book.id} className="p-4 border-b border-gray-200">
                <p><strong>Title:</strong> {book.titleBook}</p>
                <p><strong>Price:</strong> {book.price}</p>
                <p><strong>Description:</strong> {book.description}</p>
                
                <div className='mt-3 flex'>

                  <Link 
                    to={`/user/UpdateABook/${book.id}`}
                    className='bg-amber-500 p-3 rounded-lg text-white mr-3 transition-colors hover:bg-amber-800'>
                    แก้ไข
                  </Link>

                  <button 
                    onClick={() => deleteBook(book.id)}
                    className='bg-red-500 p-3 rounded-lg text-white transition-colors hover:bg-red-800'>
                    ลบ
                  </button>

                </div>

              </div>

            ))}
           
          </div>
          
        </div>

        <button 
          onClick={handleLogout}
          className='bg-red-500 p-4 text-white rounded-lg mt-3 transition-colors hover:bg-red-800'
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;