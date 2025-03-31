import { useEffect, useRef, useState } from 'react';
import Head from './components/Head';
import Navdar from './components/Navdar';
import Qr_code from "/src/assets/Qr_code.png"; // รูป QR Code
import { Banknote, FileDown } from 'lucide-react';
import axios from '../../util/axios.js';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


function PaymentPage() {
    // เก็บไฟล์ที่เลือก
    const [selectedFile, setSelectedFile] = useState(null);
    
    const navigate = useNavigate()
    const location = useLocation()

    const {orderId} = location.state || {}
    const [cost, setCost] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [values, setValues] = useState({
        payment_date: "",
        payment_time: "",
        slip_image: null,
        orderId: orderId || ""
    })

    const modalRef = useRef(null)

    const [user, setUser] = useState({
        userId: "",
        studentId: "",
    })

    const handleChange = (e) => {
        const {name, value} = e.target
        setValues((prev) => ({
            ...prev,
            [name] : value
        })) 
    }
    // ฟังก์ชันอัปโหลดไฟล์
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        
        if(file) {
            setSelectedFile(URL.createObjectURL(file))
            setValues((prev) => ({
                ...prev,
                slip_image: file
            }))
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("orderId", values.orderId)
        formData.append("payment_date", values.payment_date)
        formData.append("payment_time", values.payment_time)

        if(values.slip_image) {
            
            formData.append("paymentSlip", values.slip_image)
        
        } else {

            toast.waring("กรุณาใส่รูปภาพ")
            return;

        }

        setIsLoading(true)

        const updatePayment = await axios.put("/payment/update-payment", formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })

        if(updatePayment.status === 200) {
            
            modalRef.current.showModal();

            setTimeout(() => {
                setIsLoading(false)

            }, 2000)

            setValues({
                payment_date: "",
                payment_time: "",
                slip_image: null,
                orderId: ""
            })
        }
        
    }

    useEffect(() => {

        const checkAuth = async () => {
            try {

                const res = await axios.get('/auth/protected', { withCredentials: true })

                setUser({
                userId: res.data.user.id,
                studentId: res.data.user.studentId,
                })
                
            } catch (error) {
                console.error("User not authenticated", error);
                navigate("/"); // ถ้าไม่มี Token ให้กลับไปหน้า Login
            }
        }

        checkAuth();

    }, [navigate])

    useEffect(() => {

        const showCost = async () => {
            try {
                if(!orderId) {
                    console.error("Order ID is missing")
                    return;
                }

                const res = await axios.post("/payment/show-total-cost",
                     {orderId}, 
                     {withCredentials: true})
                setCost(res.data.totalCost);

            } catch (error) {
                console.error("Error fetching cost", error)
            }
        }
        showCost()
    },[orderId])

    return (
    <div className="bg-[#F5F5F5] min-h-screen pb-10">
      <Head studentId={user.studentId}/>
      <Navdar />

      {/* ข้อความและ icon */}
      <div className="pt-10 px-6 md:px-30 mt-25">
        <div className="flex items-center mb-6">
          <Banknote className="w-10 h-10 text-[#2d3695]" />
          <h1 className="font-bold text-2xl ml-3">ชำระเงิน</h1>
        </div>
      </div>

      {/* กรอบสีขาว */}
        <div className="flex justify-center px-4 md:px-10">
            <div className="w-full max-w-7xl bg-white flex flex-col rounded-2xl shadow-lg p-10 md:p-20">
        
                {/* ส่วนหลัก แบ่งเป็น 3 ส่วน (QR Code / อัปโหลดไฟล์ / ช่องกรอกข้อมูล) */}
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 w-full">
                    
                    {/* รูป QR Code */}
                    <div className="w-full md:w-1/3 flex justify-start flex-col">
                        <div className="w-80 h-auto border-2 border-gray-300 p-5 rounded-2xl flex flex-col items-center justify-center">
                            <img className="w-full h-auto object-cover rounded-lg" src={Qr_code} alt="QrCode" />
                            <h1 className="text-3xl font-bold mt-6 text-center p-5" style={{ fontFamily: 'Superstore, sans-serif' }}>
                                QR Code
                            </h1>
                        </div>
                        <div className='relative bottom-0 left-25 mt-5 text-2xl font-semibold'>
                            {cost} บาท
                        </div>
                    </div>

                    {/* อัปโหลดไฟล์รูป */}
                    <div className="flex flex-col items-center">
                        <h1 className="font-bold text-xl mb-2 p-6 pl-50">อัปโหลดสลิปเงิน</h1>
                        <div className="w-64 h-80 border-2 border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center">
                            {!selectedFile && (
                                <>
                                    <FileDown className="w-10 h-10 text-gray-500" />
                                    <label className="mt-3 px-4 py-2 border-2 border-gray-500 rounded-lg text-gray-500 cursor-pointer">
                                        เพิ่มรูป
                                        <input 
                                            className="hidden" 
                                            type="file" 
                                            accept="image/jpeg, image/png"
                                            onChange={handleFileChange} 
                                        />
                                    </label>
                                </>
                            )}

                            {selectedFile && (
                                <img src={selectedFile} alt='slip payment' className='w-full h-full object-contain' />
                            )}

                        </div>

                        <h5 className="text-sm text-red-500 mt-2 pr-30">* JPEG, PNG</h5>
                        
                    </div>

                    {/* ช่องกรอกข้อมูลโอนเงิน */}
                    <div className="flex flex-col items-start mt-30">

                        {/*วัน/เดือน/ปี*/ }
                        <label className="text-lg pl-5">วัน/เดือน/ปี ที่โอนเงิน</label>
                        <div className="flex space-x-2 mt-2">
                            <input 
                                type="date" 
                                className="input input-bordered border p-2 rounded-sm w-60 text-center text-gray-500 hover:text-black " 
                                name='payment_date'
                                value={values.payment_date}
                                onChange={handleChange}
                            />
                          
                        </div>

                        {/*เวลโอนเงิน*/ }
                        <label className=" text-lg mt-4 pl-5">เวลาโอนเงิน</label>
                        <div className="flex space-x-2 mt-2">
                            <input 
                                type="time" 
                                className="input input-bordered border p-2 rounded-sm w-35 text-center text-gray-500 hover:text-black"  
                                name='payment_time'
                                value={values.payment_time}
                                onChange={handleChange}
                            />
                        </div>

                        {/* ปุ่มยืนยัน */}
                        <button 
                            onClick={handleSubmit}
                            className="bg-[#358C1B] hover:bg-green-700 text-white px-20 py-2 rounded-md w-full md:w-auto ml-7 mt-25"
                        >
                            
                            ยืนยัน
                        </button>

                        <dialog ref={modalRef} id="my_modal_4" className="modal">
                            <div className="modal-box w-11/12 max-w-5xl bg-white rounded-2xl">
                                <h3 className="font-bold text-lg text-center mb-5">ชำระเงินเสร็จสิ้น</h3>
                                <div className='flex justify-center items-center flex-col'>
                                    {isLoading ? (
                                        <span className='loading loading-spinner loading-xl'></span>
                                    ): (
                                        <>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-12 h-12 text-green-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>

                                            <div className='modal-action'>
                                                <form method='dialog' className='flex flex-col'>

                                                    <button 
                                                        className="btn btn-lg rounded-lg m-5 transition-all duration-100 hover:bg-gray-600 hover:text-white"
                                                    >
                                                        ต้องการแชทกับผู้ขาย
                                                    </button>
                                                    
                                                    <button 
                                                        className="btn btn-lg rounded-lg m-5 transition-all duration-100 hover:bg-gray-600 hover:text-white"
                                                        onClick={() => navigate("/user/HomePage")}
                                                    >
                                                        เอาไว้ทีหลัง
                                                    </button>
                                                
                                                </form>
                                            </div>
                                        </>

                                        
                                    )}
                                </div>
                                
                            </div>
                        </dialog>
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
}

export default PaymentPage;
