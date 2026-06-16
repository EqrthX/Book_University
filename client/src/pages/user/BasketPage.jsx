import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { SERVER_URL } from '../../util/axios.js';
import { ShoppingCart, Trash2, ShieldAlert, CreditCard, ChevronRight } from "lucide-react";
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';

const BasketPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const cartRes = await axios.get('/cart/show-cart', { withCredentials: true });
      setCartItems(cartRes.data.books || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCheckboxChange = (cartId) => {
    setSelectedItems((prev) => {
      if (prev.includes(cartId)) {
        return prev.filter((id) => id !== cartId);
      } else {
        return [...prev, cartId];
      }
    });
  };

  const deleteItem = async (cartId) => {
    try {
      await axios.delete('/cart/delete-item-cart', {
        data: { cartIds: [cartId] },
        withCredentials: true
      });
      setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
      setSelectedItems((prev) => prev.filter((id) => id !== cartId));
      window.dispatchEvent(new Event('cart-updated'));
      toast.success("ลบสินค้าเรียบร้อย");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("ลบสินค้าไม่สำเร็จ");
    }
  };

  const deleteSelected = async () => {
    if (selectedItems.length === 0) return;
    const confirmDelete = window.confirm("ต้องการลบรายการที่เลือกทั้งหมดใช่ไหม");
    if (!confirmDelete) return;

    try {
      await axios.delete('/cart/delete-item-cart', {
        data: { cartIds: selectedItems },
        withCredentials: true
      });
      setCartItems((prev) => prev.filter((item) => !selectedItems.includes(item.cartId)));
      setSelectedItems([]);
      window.dispatchEvent(new Event('cart-updated'));
      toast.success("ลบรายการที่เลือกเรียบร้อย");
    } catch (error) {
      console.error("Error deleting items:", error);
      toast.error("ลบรายการล้มเหลว");
    }
  };

  const handleSendToPay = async () => {
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.cartId));

    if (selectedCartItems.length === 0) {
      toast.error("กรุณาเลือกสินค้าหนึ่งอย่างขึ้นไป");
      return;
    } 

    const totalPrice = selectedCartItems.reduce((total, item) => total + item.price, 0);
    const orderData = selectedCartItems.map(item => ({
        id: item.cartId,
        bookId: item.id,
        titleBook: item.titleBook,
        price: item.price
    }));
  
    navigate("/user/DeliveryPage", { state: { orderData, totalPrice } });
  };
  
  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.cartId));
  const totalPrice = selectedCartItems.reduce((total, item) => total + item.price, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="loading loading-spinner loading-lg text-[#2d3695]"></span>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-10 font-sans text-slate-800">
                
      <div className="container mx-auto px-4 md:px-8 pt-8">
        
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-8">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-8 h-8 text-[#2d3695]" />
            <h1 className="text-2xl font-black tracking-tight text-slate-800">ตะกร้าสินค้าของคุณ</h1>
          </div>
          {selectedItems.length > 0 && (
            <button 
              onClick={deleteSelected}
              className="flex items-center space-x-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-1.5 rounded-xl transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ลบที่เลือก ({selectedItems.length})</span>
            </button>
          )}
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Col (Cart items list) */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => {
                const isChecked = selectedItems.includes(item.cartId);
                const cover = item.bookPic 
                  ? `${SERVER_URL}/${item.bookPic.replace(/\\/g, "/")}` 
                  : "https://via.placeholder.com/150";

                return (
                  <div 
                    key={item.cartId} 
                    className={`flex items-center bg-white border p-4 rounded-2xl shadow-sm transition-all duration-200 ${
                      isChecked ? 'border-blue-400 bg-blue-50/10' : 'border-slate-100'
                    }`}
                  >
                    {/* Checkbox */}
                    <input 
                      type="checkbox" 
                      className="checkbox checkbox-primary w-5 h-5 mr-4" 
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(item.cartId)}
                    />

                    {/* Book Cover */}
                    <img 
                      className="w-16 h-20 object-cover rounded-lg border border-slate-100" 
                      src={cover} 
                      alt={item.titleBook || "Book"} 
                    />
                    
                    {/* Metadatas */}
                    <div className="flex-1 ml-4 pr-4"> 
                      <h4 className="font-extrabold text-sm text-slate-800 line-clamp-1">{item.titleBook}</h4> 
                      {item.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-snug">
                          รายละเอียด: {item.description}
                        </p>
                      )}
                      <span className="text-sm font-black text-blue-600 block mt-2">
                        {item.price} ฿
                      </span>
                    </div>

                    {/* Delete Item button */}
                    <button 
                      onClick={() => deleteItem(item.cartId)}
                      className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Right Col (Invoice check layout) */}
            <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-extrabold text-slate-800 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-slate-600" />
                สรุปรายการสั่งซื้อ
              </h2>
              
              <div className="border-t border-b border-slate-100 py-4 my-4 space-y-3 text-sm">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>จำนวนหนังสือทั้งหมด</span>
                  <span>{selectedItems.length} เล่ม</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>ราคารวม</span>
                  <span>{totalPrice} ฿</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-slate-800 mb-6">
                <span className="text-sm font-bold">ราคารวมสุทธิ</span>
                <span className="text-xl font-black text-blue-600">{totalPrice} ฿</span>
              </div>

              <button 
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center space-x-1"
                onClick={handleSendToPay}
              >
                <span>ดำเนินการชำระเงิน</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 bg-white rounded-2xl">
            <ShoppingCart className="w-16 h-16 text-slate-300 mb-3 animate-pulse" />
            <h3 className="font-bold text-slate-700 text-lg">ตะกร้าของคุณว่างเปล่า</h3>
            <p className="text-sm text-slate-400 mt-1">กลับไปเลือกดูหนังสือที่คุณต้องการเพื่อเริ่มช้อปปิ้ง</p>
            <button 
              onClick={() => navigate('/user/HomePage')}
              className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all"
            >
              ไปหน้าเลือกซื้อหนังสือ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasketPage;
