import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../util/axios.js'

import Navdar from "./components/Navdar";
import Head from "./components/Head";
import { ShoppingCart } from "lucide-react";
import toast from 'react-hot-toast'
const BasketPage = () => {
  
  const navigate = useNavigate();
  const [user, setUser] = useState({
    userId: "",
    studentId: "",
  });

  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      try {

        const res = await axios.get('/auth/protected', {withCredentials: true})
        setUser({
          userId: res.data.user.id,
          studentId: res.data.user.studentId,
        })

        const cartRes = await axios.get('/cart/show-cart',{withCredentials: true})
        console.log("Cart Response:", cartRes.data);
        setCartItems(cartRes.data.books || []);
        
      } catch (error) {

        console.error("User not authenticated", error);
        navigate("/"); // ถ้าไม่มี Token ให้กลับไปหน้า Login

      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  },[navigate])

  const handleCheckboxChange = (cartId) => {

    setSelectedItems((prevSelectedItems) => {

      if(prevSelectedItems.includes(cartId)) {
        return prevSelectedItems.filter((item) => item !== cartId)
      } else {
        return [...prevSelectedItems, cartId]
      }

    })

  }

  const deleteSelectedItems = async () => {
    try {

      await axios.delete(`/delete-item-cart/${selectedItems}`, {withCredentials: true})
      const cartRes = await axios.get('/show-cart',{withCredentials: true})
      console.log("Cart Response:", cartRes.data);
      setCartItems(cartRes.data.books)

    } catch (error) {
      console.error("Error deleting items", error)
    }
  }

  const handleSendToPay = async () => {
    
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.cartId))

    if(selectedCartItems.length === 0) {

      toast.error("กรุณาเลือกสินค้าหนึ่งอย่างขึ้นไป")
      return;

    } 

    const totalPrice =  selectedCartItems.reduce((total, item) => total + item.price, 0)
    const orderData = selectedCartItems.map(item => ({
        id: item.cartId,
        bookId: item.id,
        titleBook: item.titleBook,
        price: item.price
    }))
  
    navigate("/user/DeliveryPage", {state: {orderData, totalPrice}})


  }
  

  if(loading) {
    return <p className='text-xl text-center text-amber-500 animate-bounce'>Loading...</p>
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-10">
      <Head studentId={user.studentId}/>
      <Navdar />
    
      <div className="pt-25">

      {/* icon กับ ข้อความ */}
      <div className="flex flex-col items-start px-6 md:px-10 mt-2 ml-17">
        <div className="flex items-center mb-4">
          <div className="text-[#2d3695] py-5">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <h1 className="font-bold text-2xl ml-3">ตะกร้าสินค้า</h1>
        </div>
      </div>

      {/* กรอบสีขาว */}
      <div className="bg-white p-6 rounded-l-lg shadow mx-6 md:mx-10">
        <div className="grid grid-cols-10 gap-6">
          <div className="col-span-7">

            {/* ด้านซ้ายข้อมูลสินค้า */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.cartId} 
                  className="flex items-start justify-between p-4 rounded-lg shadow-sm">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 mr-3 mt-auto mb-auto" 
                    checked={selectedItems.includes(item.cartId)}
                    onChange={() => handleCheckboxChange(item.cartId)}
                    />  {/* checkbox */}
                {/* รูปหนังสือ*/}
                  <img className="w-25 h-30 mr-4" src={`http://localhost:5001/${item.bookPic}`} alt="หนังสือ" />
                  
                  <div className="flex-1 ml-4 mt-5"> 
                {/* ชื่อหนังสือ */}
                    <p className="font-bold">{item.titleBook}</p> 
                  
                    <div className="inline-flex items-center mt-2">
                      <span className="font-bold ">รายละเอียด :</span>
                {/* รายระเอียด */}
                      <p className="text-sm text-gray-700 truncate ml-2">{item.description}</p> 
                    </div>
                    <div className="block mt-2">
                      <div className="inline-flex items-center">
                        <span className="font-bold ">ราคา :</span>
                {/* ราคา */}        
                        <p className="text-sm text-gray-700 truncate ml-2"> {item.price} </p> 
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => deleteSelectedItems(item.cartId)}
                    className="bg-[#D93619] hover:bg-red-500 text-white w-25 h-10 rounded-lg"
                    >
                      ลบ
                    </button>
                </div>
              ))}
            </div>
          </div>

          {/* สรุปรายการสั่งซื้อ */}
          <div className="col-span-3 bg-gray-100 p-4 border flex flex-col h-full">
            <div>
              <h2 className="text-lg font-bold mb-4 text-center">สรุปรายการสั่งซื้อ</h2>
              <p className="w-full h-[1px] bg-black" />
              {selectedItems.length > 0 ? (

                <>
                
                <div className="text-gray-700 space-y-2 mt-5">
                  <div className="grid grid-cols-3 gap-4">
                    <p className="text-right pr-10">จำนวน</p>
                    <p className="text-right font-bold rtl">{cartItems.length}</p>  {/* ข้อมูลจำนวนหนังสือ */}
                    <p className="text-left pl-12">ชิ้น</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <p className="text-right pr-7">ราคารวม</p>
                    <p className="text-right font-bold rtl">{cartItems.reduce((total, item) => total + item.price, 0)}</p> {/* ข้อมูลราคา */}
                    <p className="text-left pl-12">บาท</p>
                  </div>
                </div>

                </>

              ) : (
                <>
                
                <div className="text-gray-700 space-y-2 mt-5">
                  <div className="grid grid-cols-3 gap-4">
                    <p className="text-right pr-10">จำนวน</p>
                    <p className="text-right font-bold rtl">0</p>  {/* ข้อมูลจำนวนหนังสือ */}
                    <p className="text-left pl-12">ชิ้น</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <p className="text-right pr-7">ราคารวม</p>
                    <p className="text-right font-bold rtl">0</p> {/* ข้อมูลราคา */}
                    <p className="text-left pl-12">บาท</p>
                  </div>
                </div>

                </>
              )}
             
            </div>

            {/* รวมราคาสุทธิ ติดกับกรอบสี่เหลี่ยม*/}
            <div className="text-gray-700 space-y-2 mt-auto">
              <p className="w-full h-[1px] border-t border-dashed border-black" /> {/* เส้นประ */}
              <div className="grid grid-cols-3 gap-4">
                <p className="text-lg font-bold text-center">ราคารวมสุทธิ</p>
                <p className="text-right font-bold rtl ">{cartItems.reduce((total, item) => total + item.price, 0)}</p>
                <p className="text-left pl-12">บาท</p>
              </div>
            </div>

            {/* ปุ่มชำระเงิน */}
            <div className="mt-5">
              <button 
                className="w-full bg-[#3D6299] text-white py-2 font-bold hover:bg-[#1e256f]"
                onClick={handleSendToPay}
              >
                ดำเนินการชำระเงิน
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default BasketPage;
