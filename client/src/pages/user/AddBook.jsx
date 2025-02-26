//import { useEffect } from 'react'
//import { useNavigate } from 'react-router-dom'
//import axios from '../../util/axios.js'

import { useState } from 'react';
import Navdar from "./components/Navdar";
import Head from "./components/Head";
import { Archive } from 'lucide-react';
import { FileDown } from 'lucide-react';

const AddBook = () => {
    const [canPickup, setCanPickup] = useState(null); // ใช้เพื่อจัดการสถานะของการเลือก "ได้" หรือ "ไม่ได้"
    const [email, setEmail] = useState('');

    const handleRadioChange = (e) => {
        setCanPickup(e.target.value); // อัปเดตสถานะเมื่อเลือก radio button
    };

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
            <Head />
            <Navdar />
            
            {/* ข้อความกับ icon */}
            <div className="flex flex-col items-start">
                <div className="flex items-center mb-4">
                    <div className="text-[#2d3695] py-5 pl-30">
                        <Archive className="w-10 h-10" />
                    </div>
                    <h1 className="font-bold text-2xl ml-3">เพิ่มหนังสือ</h1>
                </div>
                <h5 className="text-lg ml-55 -mt-9">รายละเอียด</h5>
            </div>

            {/* กรอบสีขาว */}
            <div className="grid place-items-center px-10 py-5">
                <div className="w-full max-w-450 h-150 bg-white flex items-center justify-center rounded-2xl shadow">

                    {/* กรอบเส้นประ */}
                    <div className="flex flex-col space-y-4">
                        <div className="w-80 h-100 border-2 border-dashed border-gray-400 rounded-lg p-4 mb-20 mr-auto ml-20 flex flex-col items-center justify-center">
                            <div className="flex flex-col items-center justify-center">
                                <FileDown className="w-10 h-10 text-gray-500" />
                                <label className="w-20 h-8 mt-3 flex items-center justify-center border-2 border-gray-500 rounded-lg p-2 text-gray-500 cursor-pointer">
                                    เพิ่มรูป
                                    <input className="hidden" type="file" />
                                </label>
                            </div>
                        </div>
                        {/* ข้อความใต้กรอบเส้นประ *JPEG, PNG  */}
                        <h5 className="text-sm -mt-18 ml-30 text-red-500 flex flex-col">*JPEG, PNG</h5>
                    </div>

                    {/* กรอกข้อมูล */}
                    <div className="flex flex-col space-y-4 ml-80">
                        <div className="flex flex-row space-x-4">
                            <div className="flex flex-col">
                                
                            {/* ชื่อหนังสือ */}
                                <h1 className="font-bold">ชื่อหนังสือ <span className="text-red-500">*</span></h1>
                                <input 
                                    className="bg-white w-[300px] px-2 py-1 border border-[#B7B7B7] rounded-sm mt-2"
                                    type="text"
                                    required 
                                />
                            </div>

                            {/* ราคา */}
                            <div className="flex flex-col">
                                <h1 className="font-bold">ราคา <span className="text-red-500">*</span></h1>
                                <input 
                                    className="bg-white w-[284px] px-2 py-1 border border-[#B7B7B7] rounded-sm mt-2"
                                    type="number"
                                    required 
                                />
                            </div>
                        </div>

                        {/* รายละเอียด */}
                        <div className="flex flex-col">
                            <h1 className="font-bold"> รายละเอียด </h1>
                            <input 
                                className="bg-white w-[600px] px-2 py-1 border border-[#B7B7B7] rounded-sm mt-2"
                                type="text"
                            />
                        </div>

                        {/* dropdown รหัสวิชา */}
                        <div className="flex flex-col">
                            <h1 className="font-bold"> รหัสวิชา <span className="text-red-500">*</span></h1>
                            <select 
                                className="bg-white w-[300px] px-2 py-1 border border-[#B7B7B7] rounded-sm mt-2"
                                required
                            >
                                <option value="" disabled selected>เลือกประเภท</option>
                                <option value="*">รหัสวิชา</option>
                                <option value="*">รหัสวิชา</option>
                                <option value="*">รหัสวิชา</option>
                            </select>
                        </div>

                        {/* นัดรับได้หรือไม่ ถ้ากดปุ่ม ได้ จะมีช่องให้กรอบอีเมลกับปุ่มยืนยัน ถ้าไม่ได้จะมี ปุ่มยืนยัน*/}
                        <div className="flex flex-col mt-3">
                            <h1 className="font-bold">
                                สามารถนัดรับได้หรือไม่ <span className="text-red-500">*</span>
                            </h1>
                            <div className="flex space-x-4 mt-2">
                                <label className="flex items-center space-x-2">
                                    <input 
                                        type="radio" 
                                        name="pickup"
                                        value="yes" 
                                        className="border border-[#B7B7B7] rounded-sm"
                                        onChange={handleRadioChange}
                                        required
                                    />
                                    <span className="text-lg">ได้</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input 
                                        type="radio" 
                                        name="pickup"
                                        value="no" 
                                        className="border border-[#B7B7B7] rounded-sm"
                                        onChange={handleRadioChange}
                                        required
                                    />
                                    <span className="text-lg">ไม่ได้</span>
                                </label>
                            </div>
                        </div>

                        {/* แสดงช่องกรอกอีเมล */}
                        {canPickup === 'yes' && (
                            <div className="flex flex-col ">
                                <h1 className="font-bold">
                                    กรุณากรอกอีเมล <span className="text-red-500">*</span>
                                </h1>
                                <input 
                                    className="bg-white w-[300px] px-2 py-1 border border-[#B7B7B7] rounded-sm mt-2"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {/* ปุ่ม ยืนยัน */}
                        {canPickup !== null && (
                            <div className="mt-4 ml-auto ">
                                <button className="bg-[#2d3695] text-white w-50 py-2 px-4 rounded-lg">ยืนยัน</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddBook;
