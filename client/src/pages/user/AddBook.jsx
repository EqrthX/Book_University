import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../util/axios.js'
import { FileDown, Archive } from 'lucide-react';
import toast from 'react-hot-toast';

const AddBook = () => {
    const [canPickup, setCanPickup] = useState(null);
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
        setCanPickup(value);
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
            const res = await axios.post("/product/add-book", formData, {
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
                setUser({
                    userId: res.data.user.id,
                    studentId: res.data.user.studentId,
                    email: res.data.user.email
                })
            } catch (error) {
                console.error("User not authenticated", error);
                navigate("/");
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
        <div className="bg-[#F5F5F5] min-h-screen pb-16 font-sans text-slate-800"> 
            
            {/* Main Page Header */}
            <div className="bg-gradient-to-r from-[#1A365D] to-[#2F5792] text-white py-12 px-6 md:px-12 mb-8 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                            <Archive className="w-10 h-10 text-amber-400" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-3xl">ลงขายหนังสือเรียน</h1>
                            <p className="text-slate-200 text-xs md:text-sm mt-1 font-semibold">
                                ส่งต่อหนังสือเรียนและชีทสรุปที่คุณไม่ได้ใช้แล้ว ให้กับรุ่นน้องและเพื่อนนักศึกษา UTCC
                            </p>
                        </div>
                    </div>
                    <div>
                        <button 
                            onClick={() => navigate('/user/Homepage')}
                            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors backdrop-blur-sm border border-white/10 cursor-pointer"
                        >
                            ← กลับสู่หน้าหลัก
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Page Layout Grid */}
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column: Guidelines & Community Info (lg:col-span-4) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        
                        {/* Box 1: Selling Tips */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h2 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
                                <span className="p-1.5 bg-amber-50 rounded-lg text-amber-500">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </span>
                                เคล็ดลับการขายเร็ว
                            </h2>
                            
                            <ul className="flex flex-col gap-4 text-xs font-semibold text-slate-600 leading-relaxed">
                                <li className="flex gap-2.5 items-start">
                                    <span className="text-[#2d3695] font-black">1.</span>
                                    <p>ถ่ายรูปปกหนังสือในพื้นที่ที่มีแสงสว่างชัดเจน ไม่เบลอ เพื่อสร้างความน่าเชื่อถือ</p>
                                </li>
                                <li className="flex gap-2.5 items-start">
                                    <span className="text-[#2d3695] font-black">2.</span>
                                    <p>ระบุราคาที่สมเหตุสมผล โดยทั่วไปราคาหนังสือมือสองจะอยู่ที่ 40% - 70% ของปก</p>
                                </li>
                                <li className="flex gap-2.5 items-start">
                                    <span className="text-[#2d3695] font-black">3.</span>
                                    <p>เขียนอธิบายสภาพให้ชัดเจน เช่น มีรอยจดไฮไลท์ ขอบยับ เพื่อความโปร่งใสกับผู้ซื้อ</p>
                                </li>
                            </ul>
                        </div>

                        {/* Box 2: Safety Guidelines */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h2 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
                                <span className="p-1.5 bg-emerald-50 rounded-lg text-emerald-500">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </span>
                                ข้อควรระวังความปลอดภัย
                            </h2>
                            
                            <ul className="flex flex-col gap-4 text-xs font-semibold text-slate-600 leading-relaxed">
                                <li className="flex gap-2.5 items-start">
                                    <span className="text-red-500 font-bold">•</span>
                                    <p>แนะนำให้ใช้ช่องทางนัดรับสินค้าภายในขอบเขตรั้วมหาวิทยาลัยหอการค้าไทย (UTCC) ในช่วงเวลากลางวัน</p>
                                </li>
                                <li className="flex gap-2.5 items-start">
                                    <span className="text-red-500 font-bold">•</span>
                                    <p>หลีกเลี่ยงการเปิดเผยข้อมูลส่วนตัวอื่นๆ นอกเหนือจากอีเมลติดต่อที่จำเป็นสำหรับการนัดหมาย</p>
                                </li>
                            </ul>
                        </div>

                    </div>

                    {/* Right Column: Form Container (lg:col-span-8) */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-10">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                                
                                {/* Photo Upload Row */}
                                <div className="md:col-span-12 flex flex-col">
                                    <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                                        📸 รูปภาพหนังสือที่ต้องการขาย
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                                        <div className="md:col-span-5">
                                            <div className="border-2 border-dashed border-slate-200 hover:border-[#2F5792] bg-slate-50 hover:bg-blue-50/20 rounded-2xl p-4 transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden group shadow-inner">
                                                {!showBookPic ? (
                                                    <div className="flex flex-col items-center text-center">
                                                        <div className="p-3 bg-white rounded-xl shadow-sm mb-3 text-slate-400">
                                                            <FileDown className="w-6 h-6" />
                                                        </div>
                                                        <p className="text-xs font-bold text-slate-500">คลิกเพื่ออัปโหลด</p>
                                                        <p className="text-[9px] text-slate-400 font-semibold mt-1">ไฟล์ JPG, PNG</p>
                                                        
                                                        <label className="mt-3 px-3 py-1.5 bg-[#2F5792] text-white hover:bg-[#1A365D] rounded-lg text-[10px] font-bold transition-all shadow-sm cursor-pointer">
                                                            เลือกรูปภาพ
                                                            <input 
                                                                className="hidden" 
                                                                type="file" 
                                                                name='bookPic'
                                                                accept="image/*"
                                                                onChange={handleFileChange}
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="relative w-full h-full min-h-[180px] flex items-center justify-center">
                                                        <img src={showBookPic} alt='Book Preview' className='w-full h-full object-contain rounded-xl max-h-[190px]'/>
                                                        
                                                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer rounded-xl font-bold text-[10px] gap-1 backdrop-blur-xs">
                                                            <FileDown className="w-5 h-5" />
                                                            <span>เปลี่ยนรูป</span>
                                                            <input 
                                                                className="hidden" 
                                                                type="file" 
                                                                name='bookPic'
                                                                accept="image/*"
                                                                onChange={handleFileChange}
                                                            />
                                                        </label>
                                                        
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                setShowBookPic(null);
                                                                setValuesBook(prev => ({ ...prev, bookPic: null }));
                                                            }}
                                                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md transition-all cursor-pointer z-20"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="md:col-span-7 text-xs text-slate-500 font-semibold flex flex-col gap-2">
                                            <p className="text-slate-700 font-bold">เงื่อนไขการใส่รูปภาพปก:</p>
                                            <p className="text-[11px]">• ต้องเห็นหน้าปกหนังสืออย่างเป็นทางการ หรือจุดที่ระบุรุ่นอย่างชัดเจน</p>
                                            <p className="text-[11px]">• ขนาดภาพแนะนำ 600x800 พิกเซล (แนวตั้ง)</p>
                                            <p className="text-[11px] text-red-500 font-bold">• กรุณาใส่ไฟล์รูปภาพนามสกุล JPEG หรือ PNG เท่านั้น</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Input details */}
                                <div className="md:col-span-12 flex flex-col mt-4">
                                    <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                                        📝 รายละเอียดหนังสือ
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Book Title */}
                                        <div className="flex flex-col">
                                            <label className="text-xs font-bold text-slate-700 mb-2">ชื่อหนังสือ <span className="text-red-500">*</span></label>
                                            <input 
                                                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl px-4 py-3 text-xs font-semibold transition-all text-slate-800 outline-none shadow-sm placeholder-slate-400"
                                                type="text"
                                                name='titleBook'
                                                placeholder="กรอกชื่อหนังสือเรียน เช่น หลักการตลาด..."
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
                                                placeholder="เช่น 150..."
                                                value={valuesBook.price}
                                                onChange={handleChange}
                                                required 
                                            />
                                        </div>

                                        {/* Subject Selection */}
                                        <div className="flex flex-col">
                                            <label className="text-xs font-bold text-slate-700 mb-2">ตรงกับรายวิชา <span className="text-red-500">*</span></label>
                                            <select 
                                                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl px-4 py-3 text-xs font-semibold transition-all text-slate-800 outline-none shadow-sm"
                                                required
                                                name='subjectId'
                                                value={valuesBook.subjectId}
                                                onChange={handleChange}
                                            >
                                                <option value="" disabled>กรุณาเลือกวิชา...</option>
                                                {loading ? (
                                                    <option disabled>กำลังโหลดรายชื่อวิชา...</option>
                                                ) : (
                                                    subjects.map((subject) => (
                                                        <option key={subject.id} value={subject.id}>
                                                            {subject.subjectCode}
                                                        </option>
                                                    ))
                                                )}
                                            </select>
                                        </div>

                                        {/* Delivery/Pickup Selectors */}
                                        <div className="flex flex-col">
                                            <label className="text-xs font-bold text-slate-700 mb-2">สะดวกนัดรับภายใน ม. หรือไม่ <span className="text-red-500">*</span></label>
                                            
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
                                                        required
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
                                                        required
                                                    />
                                                    <span>📦 ส่งพัสดุเท่านั้น</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description Box */}
                                <div className="md:col-span-12 flex flex-col">
                                    <label className="text-xs font-bold text-slate-700 mb-2">สภาพหนังสือ/รายละเอียดเพิ่มเติม</label>
                                    <textarea 
                                        rows={4}
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl px-4 py-3 text-xs font-semibold transition-all text-slate-800 outline-none shadow-sm placeholder-slate-400 resize-none"
                                        name='description'
                                        placeholder="สภาพเหมือนใหม่ ไม่มีรอยขีดเขียน หรือมีรอยขีดเขียนจำนวนกี่หน้า..."
                                        value={valuesBook.description}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Conditional Email */}
                                {canPickup === 'yes' && (
                                    <div className="md:col-span-12 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                                        <label className="text-xs font-bold text-slate-700 mb-2">อีเมลติดต่อกลับสำหรับนัดรับสินค้า <span className="text-red-500">*</span></label>
                                        <input 
                                            className="w-full bg-slate-50 border border-slate-200 focus:border-[#2F5792] focus:ring-2 focus:ring-[#2F5792]/10 rounded-xl px-4 py-3 text-xs font-semibold transition-all text-slate-800 outline-none shadow-sm placeholder-slate-400"
                                            type="email"
                                            value={valuesBook.contactInfo}
                                            placeholder="เช่น student@utcc.ac.th"
                                            name='contactInfo'
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                )}

                                {/* Buttons Action */}
                                <div className="md:col-span-12 flex flex-col sm:flex-row justify-end items-center gap-3 mt-4 border-t border-slate-100 pt-6">
                                    <button 
                                        type="button"
                                        onClick={() => navigate('/user/Homepage')}
                                        className="w-full sm:w-auto px-6 py-2.5 border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer text-center"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button 
                                        type="submit"
                                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#2F5792] to-[#2B6CB0] border-0 text-white font-bold hover:shadow-lg rounded-xl text-xs transition-all shadow-md cursor-pointer text-center"
                                    >
                                        ลงขายหนังสือ
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

export default AddBook;
