import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../util/axios.js'

import Navdar from "./components/Navdar";
import Head from "./components/Head";

import { FileDown, Archive } from 'lucide-react';
import toast from 'react-hot-toast';

const AddBook = () => {

    const [canPickup, setCanPickup] = useState(null); // ใช้เพื่อจัดการสถานะของการเลือก "ได้" หรือ "ไม่ได้"
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBookPic, setShowBookPic] = useState(null);

    const [user, setUser] = useState({
        userId: "",
        studentId: "",
    });

    const [valuesBook, setValuesBook] = useState({
        userId: user.userId,
        titleBook: "",
        price: "",
        description: "",
        subjectId: "",
        contactInfo: "",
        bookPic: null,
        pickUp: ""
    })

    const handleRadioChange = (e) => {
        const {value} = e.target
        setCanPickup(value); // อัปเดตสถานะเมื่อเลือก radio button
        setValuesBook((prevValues) => ({
            ...prevValues,
            pickUp: value,
            contactInfo: value === "yes" ? valuesBook.contactInfo: ""
        }))
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setShowBookPic(URL.createObjectURL(file));
            setValuesBook((prevValues) => ({
                ...prevValues,
                bookPic: file
            }));
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target

        if(name === "pickup" && value === "no") {
            setValuesBook((prevValues) => ({
                ...prevValues,
                email: ""
            }))
        }

        setValuesBook((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    }

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(valuesBook);
        if(!valuesBook.titleBook || !valuesBook.price || !valuesBook.subjectId) {
            toast.error("กรุณากรอกข้อมูลที่บังคับด้วย")
            return;
        }

        if (valuesBook.pickUp === "yes" && !valuesBook.contactInfo) {
            toast.error("กรุณากรอกอีเมล");
            return;
        }

        const formData = new FormData()
        
        formData.append("titleBook", valuesBook.titleBook);
        formData.append("price", valuesBook.price);
        formData.append("description", valuesBook.description);
        formData.append("subjectId", valuesBook.subjectId);
        formData.append("pickUp", valuesBook.pickUp);
        formData.append("contactInfo", valuesBook.contactInfo);

        if(valuesBook.bookPic) {
            formData.append("bookPic", valuesBook.bookPic);
        } else {
            toast.error("กรุณาเพิ่มรูปภาพหนังสือ");
            return;
        }

        try {
            
            const res = await axios.post("/add-book", formData, {
                withCredentials: true,
                headers: {
                    "Content-Type" : "multipart/form-data"
                }
            })

            if(res.status === 201 || res.status === 200) {
                toast.success("เพิ่มสินค้าหนังสือเรียบร้อย")

                navigate('/user/Homepage')
            }

        } catch (error) {

            console.error("Error add book:", error);
            toast.error("เกิดข้อผิดพลาดในการเพิ่มหนังสือ");

        }

    }
    
    useEffect(() => {
        const checkAuth = async () => {
        try {
            const res = await axios.get('/auth/protected', {withCredentials: true})
            
            console.log("Auth Response: ", res.data);

            setUser({
                userId: res.data.user.id,
                studentId: res.data.user.studentId,
                email: res.data.user.email
            })
        } catch (error) {
            console.error("User not authenticated", error);
            navigate("/"); // ถ้าไม่มี Token ให้กลับไปหน้า Login
        }
        }

        checkAuth()
    },[navigate])

    useEffect(() => {
        const fetchSubjectsAll = async () => {
            if(!user.studentId) return;
            try {
    
                const res = await axios.get("/get-subjects", {withCredentials: true})
                setSubjects(res.data.subjectCode || [])
                setLoading(false)
                
            } catch (error) {
                console.error("Error feteching subjects:", error);
                navigate('/')
            }
        }
        
        fetchSubjectsAll();

    }, [user.studentId])

    return (
        <div className="bg-[#F5F5F5] min-h-screen"> 
            <Head studentId={user.studentId}/>
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
                    
                    <form onSubmit={handleSubmit} className='flex'>
                        {/* กรอบเส้นประ */}
                        <div className="flex flex-col space-y-4">
                            <div className="w-80 h-100 border-2 border-dashed border-gray-400 rounded-lg p-4 mb-20 mr-auto ml-20 flex flex-col items-center justify-center">
                                <div className="flex flex-col items-center justify-center">
                                    
                                    {!showBookPic && (
                                        <>
                                            <FileDown className="w-10 h-10 text-gray-500" />
                                            <label className="w-20 h-8 mt-3 flex items-center justify-center border-2 border-gray-500 rounded-lg p-2 text-gray-500 cursor-pointer">
                                            เพิ่มรูป
                                            <input 
                                                className="hidden" 
                                                type="file" 
                                                name='bookPic'
                                                onChange={handleFileChange}
                                                />
                                            </label>
                                        </>
                                    )}
                                    
                                </div>
                                
                                {showBookPic && (
                                    <img src={showBookPic} alt='Book Preview' className='mt-4 w-full h-full object-contain'/>
                                )}
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
                                        name='titleBook'
                                        value={valuesBook.titleBook}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>

                                {/* ราคา */}
                                <div className="flex flex-col">
                                    <h1 className="font-bold">ราคา <span className="text-red-500">*</span></h1>
                                    <input 
                                        className="bg-white w-[284px] px-2 py-1 border border-[#B7B7B7] rounded-sm mt-2"
                                        type="number"
                                        name='price'
                                        value={valuesBook.price}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                            </div>

                            {/* รายละเอียด */}
                            <div className="flex flex-col">
                                <h1 className="font-bold"> รายละเอียด </h1>
                                <input 
                                    className="bg-white w-[600px] px-2 py-1 border border-[#B7B7B7] rounded-sm mt-2"
                                    name='description'
                                    type="text"
                                    value={valuesBook.description}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* dropdown รหัสวิชา */}
                            <div className="flex flex-col">

                                <h1 className="font-bold"> รหัสวิชา <span className="text-red-500">*</span></h1>

                                <select 
                                    className="bg-white w-[300px] px-2 py-1 border border-[#B7B7B7] rounded-sm mt-2"
                                    required
                                    name='subjectId'
                                    value={valuesBook.subjectId} // ให้ React ควบคุมค่า
                                    onChange={handleChange} // อัปเดตค่าเมื่อเลือก
                                >
                                    <option value="" disabled>เลือกประเภท</option>
                                    {loading ? (
                                        <option disabled>กำลังโหลด...</option>
                                    ) : (
                                        subjects.map((subject) => (
                                            <option key={subject.id} value={subject.id}>
                                                {subject.subjectCode}
                                            </option>
                                        ))
                                    )}

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
                                            name="pickUp"
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
                                            name="pickUp"
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
                                        type="text"
                                        value={valuesBook.contactInfo}
                                        name='contactInfo'
                                        onChange={handleChange}
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
                    </form>

                </div>

            </div>

        </div>
    );
}

export default AddBook;