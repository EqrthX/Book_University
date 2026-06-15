import { Navigate, Route, Routes } from 'react-router-dom'

import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'

import AdminHomePage from '../pages/admin/AdminHomePage'
import AdminRegister from '../pages/admin/AdminRegister'
import AdminCheckBooks from '../pages/admin/AdminCheckBooks'
import AdminCheckPayment from '../pages/admin/AdminCheckPayment'
import AdminDetailsPayment from '../pages/admin/AdminDetailsPayment'

import HomePage from '../pages/user/pages/HomePage'
import AddBook from '../pages/user/pages/AddBook'
import DetailsPage from '../pages/user/pages/DetailsPage'
import BasketPage from '../pages/user/pages/ฺฺฺฺBasketPage'
import ProfilePage from '../pages/user/pages/ProfilePage'
import BuyHistoryPage from '../pages/user/pages/BuyHistoryPage'
import SellHistoryPage from '../pages/user/pages/SellHistoryPage'
import BuyNowPage from '../pages/user/pages/BuyNowPage'
import DeliveryPage from '../pages/user/pages/DeliveryPage'
import PaymentPage from '../pages/user/pages/PaymentPage'
import NotificationPage from '../pages/user/pages/NotificationPage'
import UpdateABook from '../pages/user/pages/UpdateABook'
import SearchPage from '../pages/user/pages/SearchPage'
import OrderPage from '../pages/user/pages/OrderPage'
import ChatPage from '../pages/user/pages/ChatPage'
import BookDetail from '../pages/user/pages/BookDetail'
import UpdateSlip from '../pages/user/pages/UpdateSlip'

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />

      <Route path='/admin/AdminHomePage' element={<AdminHomePage />}>
        <Route index element={<Navigate to="register" />} />
        <Route path='register' element={<AdminRegister />} />
        <Route path='check-books' element={<AdminCheckBooks />} />
        <Route path='check-payment' element={<AdminCheckPayment />} />
        <Route path='check-payment/details-payment/:id' element={<AdminDetailsPayment />} />
      </Route>

      <Route path="/user/HomePage" element={<HomePage />} />
      <Route path="/user/AddBook" element={<AddBook />} />
      <Route path="/user/DetailsPage/:id" element={<DetailsPage />} />
      <Route path="/user/BasketPage" element={<BasketPage />} />
      <Route path="/user/ProfilePage" element={<ProfilePage />} />
      <Route path="/user/UpdateABook/:id" element={<UpdateABook />} />
      <Route path="/user/BuyHistoryPage" element={<BuyHistoryPage />} />
      <Route path="/user/SellHistoryPage" element={<SellHistoryPage />} />
      <Route path="/user/BuyNowPage/:id" element={<BuyNowPage />} />
      <Route path="/user/DeliveryPage" element={<DeliveryPage />} />
      <Route path="/user/PaymentPage" element={<PaymentPage />} />
      <Route path="/user/search" element={<SearchPage />} />
      <Route path="/user/NotificationPage" element={<NotificationPage />} />
      <Route path="/user/BookDetail/:id" element={<BookDetail />} />
      <Route path='/user/OrderPage' element={<OrderPage />} />
      <Route path='/user/Chat' element={<ChatPage />} />
      <Route path='/user/UpdateSlip/:id' element={<UpdateSlip />} />
    </Routes>
  )
}

export default AppRoutes
