import { useEffect, useState } from 'react';
import axios from '../../util/axios.js';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Head from './components/Head.jsx';
import Navdar from './components/Navdar.jsx';
import toast from 'react-hot-toast';


const UpdateABook = () => {

    const { id } = useParams();
    const [canPickup, setCanPickup] = useState(null); // ใช้เพื่อจัดการสถานะของการเลือก "ได้" หรือ "ไม่ได้"
    const [profile, setProfile] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

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
    const navigate = useNavigate();
    
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

    useEffect(() => {
        const fetchUserAndSubjects  = async () => {
            try {
                const res = await axios.get('/auth/protected', { withCredentials: true });
                setUser(res.data.user);
                setProfile(res.data.user);

                if(res.data.user.studentId) {
                    const subjectsRes = await axios.get("/get-subjects", {withCredentials: true})
                    console.log(subjectsRes);
                    setSubjects(subjectsRes.data.subjectCode || [])
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching user profile", error);
                navigate("/");
            }
        };

        fetchUserAndSubjects();
    }, [navigate, user.studentId]);

    useEffect(() => {

        if(!id) return;

        const fetechingBook = async () => {
        try {
            const res = await axios.get(`/show-for-edit-IdBook/${id}`, { withCredentials: true });
            setValuesBook({
                userId: user.userId,
                titleBook: res.data.books.titleBook || "",
                price: res.data.books.price || "",
                description: res.data.books.description || "",
                subjectId: res.data.books.subjectId || "",
                contactInfo: res.data.books.contactInfo || "",
                bookPic: res.data.books.bookPic || null, 
                pickUp: res.data.books.canMeet || ""
            })
            
            } catch (error) {
                console.error('Error fetching user product', error);
                
            }
        }
        fetechingBook();

    }, [id, user.userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.put(`/update-book/${id}`, valuesBook, { withCredentials: true });
            if(res.status === 200) {
                toast.success("แก้ไขสำเร็จ");
                navigate('/user/ProfilePage');
            }
        } catch (error) {
            console.error('Error fetching user product', error);
        }

    }

    return (
        <div className="bg-[#F5F5F5] min-h-screen"> 
            <Head studentId={user.studentId} />
            <Navdar />
            <div className="pt-20">
                <div className='container mx-auto px-4 md:px-8 mt-10 flex flex-col justify-center'>
                    <h1 className='text-2xl font-bold text-center mb-5'>แก้ไขรายการหนังสือ</h1>

                    <form 
                        onSubmit={handleSubmit}
                        className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 grid grid-cols-2 gap-4 justify-center place-items-center'
                    >
                        
                        <div className='w-72 h-fit col-span-2 flex justify-center items-center'>
                            <img 
                                src={`http://localhost:5001/${valuesBook.bookPic}`} 
                                alt="book" 
                                className="w-full h-full object-cover"
                            />

                        </div>

                        <div className='mb-4 flex flex-col'>
                            <label className='flex items-center'>ชื่อหนังสือ</label>
                            <input 
                                className="bg-white w-72 px-2 py-1 border border-[#B7B7B7] rounded-sm mt-2"
                                type="text"
                                name='titleBook'
                                value={valuesBook.titleBook}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='mb-4 flex flex-col'>
                            <label className='flex items-center'>ราคา</label>
                            <input 
                                className="bg-white w-72 px-2 py-1 border border-[#B7B7B7] rounded-sm mt-2"
                                type="number"
                                name='price'
                                value={valuesBook.price}
                                onChange={handleChange} 
                            />
                        </div>

                        <div className='mb-4 flex flex-col'>
                            <label className='flex items-center'>รายละเอียด</label>
                            <input 
                                className="bg-white w-72 px-2 py-1 border border-[#B7B7B7] rounded-sm mt-2"
                                type="text"
                                name='description'
                                value={valuesBook.description}
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="flex flex-col">

                            <h1 className="font-bold"> รหัสวิชา <span className="text-red-500">*</span></h1>

                            <select 
                                className="bg-white w-[300px] px-2 py-1 border border-[#B7B7B7] rounded-sm mt-2"
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

                        <div className="flex flex-col mt-3 items-center text-center">

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
                                        />

                                            <span className="text-lg">ไม่ได้</span>

                                        </label>
                            </div>

                        </div>

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
                        <div className="mt-4 flex justify-center">
                            <button 
                                className={`w-50 py-2 px-4 rounded-lg transition-colors 
                                    ${canPickup ? 'bg-[#2d3695] text-white hover:bg-blue-700' 
                                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
                                disabled={!canPickup} // ปิดใช้งานปุ่มถ้ายังไม่ได้เลือก
                            >
                                ยืนยัน
                            </button>
                        </div>
    
                    </form>

                </div>
            </div>
        </div>
    )
}

export default UpdateABook
