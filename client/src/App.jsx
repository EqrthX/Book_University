
import { Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import LoginPage from './pages/LoginPage'

import AdminHomePage from './pages/admin/AdminHomePage'
import AdminRegister from './pages/admin/AdminRegister'

import HomePage from './pages/user/HomePage'
import {Toaster} from 'react-hot-toast'
import AdminCheckBooks from './pages/admin/AdminCheckBooks'
import AdminCheckPayment from './pages/admin/AdminCheckPayment'

function App() {
  
  return (
    <>
    <Toaster />
      <Routes>
        <Route path='/login' element={<LoginPage/>} />

        <Route path='/admin/AdminHomePage' element={<AdminHomePage/>}>
          
          <Route index element={<Navigate to="register"/>} />

          <Route path='register' element={<AdminRegister/>}/>
          <Route path='check-books' element={<AdminCheckBooks/>}/>
          <Route path='check-payment' element={<AdminCheckPayment/>}/>
        
        </Route>

        <Route path='/user/Homepage' element={<HomePage/>}>
        
        </Route>
      </Routes>  
    </>
  )
}

export default App
