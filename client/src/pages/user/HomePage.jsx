import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../util/axios.js'

const HomePage = () => {

  const navigate = useNavigate();

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
  },[navigate])

  return (
    <div>
      HomePage User
    </div>
  )
}

export default HomePage
