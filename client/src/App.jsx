
import { Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import LoginPage from './pages/LoginPage'


import AdminHomePage from './pages/admin/AdminHomePage'
import AdminRegister from './pages/admin/AdminRegister'
import AdminCheckBooks from './pages/admin/AdminCheckBooks'
import AdminCheckPayment from './pages/admin/AdminCheckPayment'

import HomePage from './pages/user/HomePage'
import AddBook from './pages/user/AddBook'
import DetailsPage from './pages/user/DetailsPage'
import BasketPage from './pages/user/ฺฺฺฺBasketPage'
import ProfilePage from './pages/user/ProfilePage'

import {Toaster} from 'react-hot-toast'
import UpdateABook from './pages/user/UpdateABook'

function App() {
  
  return (
    <>
    <Toaster />
      <Routes>
        <Route path='/' element={<LoginPage/>} />

        <Route path='/admin/AdminHomePage' element={<AdminHomePage/>}>
          
          <Route index element={<Navigate to="register"/>} />

          <Route path='register' element={<AdminRegister/>}/>
          <Route path='check-books' element={<AdminCheckBooks/>}/>
          <Route path='check-payment' element={<AdminCheckPayment/>}/>
        
        </Route>

        <Route path="/user/HomePage" element={<HomePage />} />
        <Route path="/user/AddBook" element={<AddBook />} />
        <Route path="/user/DetailsPage/:id" element={<DetailsPage />} />
        <Route path="/user/BasketPage" element={<BasketPage />} />
        <Route path="/user/ProfilePage" element={<ProfilePage />} />
        <Route path="/user/UpdateABook/:id" element={<UpdateABook/>}/>
        
      </Routes>  
    </>
  )
}

export default App
