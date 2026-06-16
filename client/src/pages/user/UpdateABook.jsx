import { useEffect, useState } from 'react';
import axios from '../../util/axios.js';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FileDown, Archive } from 'lucide-react';

const UpdateABook = () => {
    const { id } = useParams();
    const [canPickup, setCanPickup] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
        setCanPickup(value);
        setValuesBook((prevValues) => ({
            ...prevValues,
            pickUp: value,
            contactInfo: value === "yes" ? valuesBook.contactInfo: ""
        }))
    };
    
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
        const fetchUserAndSubjects = async () => {
            try {
                const res = await axios.get('/auth/protected', { withCredentials: true });
                setUser(res.data.user);

                if(res.data.user.studentId) {
                    const subjectsRes = await axios.get("/get-subjects", {withCredentials: true})
                    setSubjects(subjectsRes.data.subjectCode || [])
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching user profile", error);
                navigate("/");
            }
        };

        fetchUserAndSubjects();
    }, [navigate]);

    useEffect(() => {
        if(!id) return;

        const fetchingBook = async () => {
            try {
                const res = await axios.get(`/show-for-edit-IdBook/${id}`, { withCredentials: true });
                const bookData = res.data.books || {};
                setValuesBook({
                    userId: user.userId,
                    titleBook: bookData.titleBook || "",
                    price: bookData.price || "",
                    description: bookData.description || "",
                    subjectId: bookData.subjectId || "",
                    contactInfo: bookData.contactInfo || "",
                    bookPic: bookData.bookPic || null, 
                    pickUp: bookData.canMeet || ""
                });
                setCanPickup(bookData.canMeet || null);
            } catch (error) {
                console.error('Error fetching user product', error);
            }
        }
        fetchingBook();
    }, [id, user.userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!valuesBook.titleBook || !valuesBook.price || !valuesBook.subjectId) {
            toast.error("กรุณากรอกข้อมูลที่บังคับด้วย");
            return;
        }

        if (valuesBook.pickUp === "yes" && !valuesBook.contactInfo) {
            toast.error("กรุณากรอกอีเมลติดต่อกลับ");
            return;
        }

        try {
            const res = await axios.put(`/product/update-book/${id}`, valuesBook, { withCredentials: true });
            if(res.status === 200) {
                toast.success("แก้ไขสินค้าเรียบร้อย");
                navigate('/user/ProfilePage');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
        }
    }

    return (
        <div className="bg-[#F5F5F5] min-h-screen pb-16 font-sans text-slate-800"> 
            
            {/* Main Page Header */}
            <div className="bg-gradient-to-r from-[#1A365D] to-[#2F5792] text-white py-12 px-6 md:px-12 mb-8 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                            <Archive className="w-10 h-10 text-amber-400" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-3xl">แก้ไขรายการหนังสือ</h1>
                            <p className="text-slate-200 text-xs md:text-sm mt-1 font-semibold">
                                แก้ไขรายละเอียดข้อมูลและรูปแบบการจัดส่งของหนังสือเรียนที่คุณลงขาย
                            </p>
                        </div>
                    </div>
                    <div>
                        <button 
                            onClick={() => navigate('/user/ProfilePage')}
                            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors backdrop-blur-sm border border-white/10 cursor-pointer"
                        >
                            ← กลับสู่หน้าโปรไฟล์
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Page Layout Grid */}
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column: Guidelines & Preview */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        
                        {/* Book Preview Image container */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center">
                            <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4 text-left w-full border-b border-slate-100 pb-2">
                                📸 รูปปกหนังสือปัจจุบัน
                            </h2>
                            <div className="w-full h-80 rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-center shadow-inner overflow-hidden">
                                {valuesBook.bookPic ? (
                                    <img 
                                        src={`http://localhost:5001/${valuesBook.bookPic.replace(/\\/g, "/")}`} 
                                        alt="Book Cover Preview" 
                                        className="w-full h-full object-contain rounded-xl hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="text-slate-300 flex flex-col items-center gap-2">
                                        <FileDown className="w-10 h-10" />
                                        <span className="text-xs font-bold">ไม่มีข้อมูลรูปภาพ</span>
                                    </div>
                                )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold text-center mt-3 leading-relaxed">
                                *หมายเหตุ: การแก้ไขโพสต์ไม่รองรับการเปลี่ยนไฟล์รูปภาพ หากรูปภาพไม่ถูกต้องกรุณาลบโพสต์นี้แล้วสร้างโพสต์ใหม่
                            </span>
                        </div>

                    </div>

                    {/* Right Column: Edit Fields form */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-10">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                                
                                <div className="md:col-span-12 flex flex-col">
                                    <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                                        📝 แก้ไขรายละเอียดของหนังสือ
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Book Title */}
                                        <div className="flex flex-col">
                                            <label className="text-xs font-bold text-slate-700 mb-2">ชื่อหนังสือ <span className="text-red-500">*</span></label>
                                            <input 
                                                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl px-4 py-3 text-xs font-semibold transition-all text-slate-800 outline-none shadow-sm placeholder-slate-400"
                                                type="text"
                                                name='titleBook'
                                                value={valuesBook.titleBook}
                                                onChange={handleChange}
                                                required 
                                            />
                                        </div>

                                        {/* Book Price */}
                                        <div className="flex flex-col">
                                            <label className="text-xs font-bold text-slate-700 mb-2">ราคาขาย (บาท) <span className="text-red-500">*</span></label>
                                            <input 
                                                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl px-4 py-3 text-xs font-semibold transition-all text-slate-800 outline-none shadow-sm placeholder-slate-400"
                                                type="number"
                                                name='price'
                                                value={valuesBook.price}
                                                onChange={handleChange}
                                                required 
                                            />
                                        </div>

                                        {/* Subject dropdown list */}
                                        <div className="flex flex-col">
                                            <label className="text-xs font-bold text-slate-700 mb-2">ตรงกับรายวิชา <span className="text-red-500">*</span></label>
                                            <select 
                                                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl px-4 py-3 text-xs font-semibold transition-all text-slate-800 outline-none shadow-sm"
                                                required
                                                name='subjectId'
                                                value={valuesBook.subjectId}
                                                onChange={handleChange}
                                            >
                                                <option value="" disabled>เลือกวิชาเรียน...</option>
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

                                        {/* Delivery options */}
                                        <div className="flex flex-col">
                                            <label className="text-xs font-bold text-slate-700 mb-2">สะดวกนัดรับสินค้าใน ม. หรือไม่ <span className="text-red-500">*</span></label>
                                            
                                            <div className="grid grid-cols-2 gap-3">
                                                <label className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border-2 cursor-pointer transition-all ${
                                                    canPickup === "yes" 
                                                        ? "border-[#2F5792] bg-[#2F5792]/5 text-[#2F5792] font-bold shadow-sm" 
                                                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-500 text-xs font-semibold"
                                                }`}>
                                                    <input 
                                                        type="radio" 
                                                        name="pickUp"
                                                        value="yes" 
                                                        className="sr-only"
                                                        onChange={handleRadioChange}
                                                        checked={canPickup === "yes"}
                                                    />
                                                    <span>🤝 นัดรับสินค้า</span>
                                                </label>

                                                <label className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border-2 cursor-pointer transition-all ${
                                                    canPickup === "no" 
                                                        ? "border-[#2F5792] bg-[#2F5792]/5 text-[#2F5792] font-bold shadow-sm" 
                                                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-500 text-xs font-semibold"
                                                }`}>
                                                    <input 
                                                        type="radio" 
                                                        name="pickUp"
                                                        value="no" 
                                                        className="sr-only"
                                                        onChange={handleRadioChange}
                                                        checked={canPickup === "no"}
                                                    />
                                                    <span>📦 ส่งพัสดุเท่านั้น</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Book Condition / Description details */}
                                <div className="md:col-span-12 flex flex-col">
                                    <label className="text-xs font-bold text-slate-700 mb-2">สภาพหนังสือ/รายละเอียดเพิ่มเติม</label>
                                    <textarea 
                                        rows={4}
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl px-4 py-3 text-xs font-semibold transition-all text-slate-800 outline-none shadow-sm placeholder-slate-400 resize-none"
                                        name='description'
                                        value={valuesBook.description}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Pre-filled Contact info */}
                                {canPickup === 'yes' && (
                                    <div className="md:col-span-12 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                                        <label className="text-xs font-bold text-slate-700 mb-2">อีเมลติดต่อกลับสำหรับนัดรับสินค้า <span className="text-red-500">*</span></label>
                                        <input 
                                            className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl px-4 py-3 text-xs font-semibold transition-all text-slate-800 outline-none shadow-sm placeholder-slate-400"
                                            type="email"
                                            value={valuesBook.contactInfo}
                                            name='contactInfo'
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                )}

                                {/* Buttons actions */}
                                <div className="md:col-span-12 flex flex-col sm:flex-row justify-end items-center gap-3 mt-4 border-t border-slate-100 pt-6">
                                    <button 
                                        type="button"
                                        onClick={() => navigate('/user/ProfilePage')}
                                        className="w-full sm:w-auto px-6 py-2.5 border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer text-center"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button 
                                        type="submit"
                                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#2F5792] to-[#2B6CB0] border-0 text-white font-bold hover:shadow-lg rounded-xl text-xs transition-all shadow-md cursor-pointer text-center"
                                    >
                                        บันทึกการแก้ไข
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default UpdateABook;
