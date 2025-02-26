//import { useEffect } from 'react'
//import { useNavigate } from 'react-router-dom'
//import axios from '../../util/axios.js'

import { Link } from 'react-router-dom';
import Book from "/src/assets/Book1.jpg";
import Promote from "/src/assets/Promote.png";
import Navdar from "./components/Navdar";
import Head from "./components/Head";

const HomePage = () => {
  
  /*const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/auth/protected', {withCredentials: true})
        console.log(res);
      } catch (error) {
        console.error("User not authenticated", error);
        navigate("/login"); // ถ้าไม่มี Token ให้กลับไปหน้า Login
      }
    }

    checkAuth()
  },[navigate])*/

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      
      <Head/>
      <Navdar/>
      <img className='w-full' src={Promote}/> {/*รูปหนังสืออันใหญ่*/}
      <div className="container mx-auto px-4 md:px-8 mt-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 gap-y-10">
            {[...Array(8)].map((_, index) => (
              <Link to="/user/DetailsPage" key={index} className="flex justify-center">
                <div className="w-72 bg-white hover:bg-gray-200 border border-gray-100 rounded-lg shadow overflow-hidden">
                  <div className="flex justify-center items-center py-4">
                    <img className="w-2/4 h-auto" src={Book} alt="หนังสือ" />
                  </div>
                  <div className="p-5">
                    <h2 className="mb-2 text-lg font-bold text-gray-900 truncate">
                      หนังสือวิชา การตลาด 
                    </h2>
                    <h5 className="mb-2 text-l font-bold text-gray-900">
                      รายละเอียด :
                    </h5>
                    <p className="mb-3 font-bold text-xl text-gray-700">$500</p>
                  </div>
                </div>
              </Link>
            ))}
          
        </div>
      </div>
    </div>
  );
}

export default HomePage;