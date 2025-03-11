import { useEffect, useState } from 'react';
import axios from '../../util/axios.js';
import { Link, useNavigate } from 'react-router-dom';
import Head from './components/Head.jsx';
import Navdar from './components/Navdar.jsx';
import toast from 'react-hot-toast';
import { LogOut } from 'lucide-react';


const ProfilePage = () => {

  const [studentId, setStudentId] = useState("");
  const [profile, setProfile] = useState(null);
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

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
      navigate('/');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };
  if (!studentId) {
    return <div className='text-5xl animate-bounce'>Loading...</div>;
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <Head studentId={studentId} />
      <Navdar />
    <div className='pt-15'>
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

        
        <button 
          onClick={handleLogout}
          className='bg-red-600 p-4 text-white text-lg rounded-lg font-bold mt-3 transition-colors hover:bg-red-800 flex items-center justify-center gap-2'>
          <LogOut />
          <span>Logout</span>
        </button>


      </div>

    </div>
  </div>
  );
};

export default ProfilePage;