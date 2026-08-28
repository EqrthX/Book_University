import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../util/axios.js';
import { getImageUrl } from '../../util/image.js';

const BookDetail = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        userId: "",
        studentId: "",
    });
    const { id } = useParams();
    const [book, setBook] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get('/auth/protected', { withCredentials: true });
                setUser({
                    userId: res.data.user.id,
                    studentId: res.data.user.studentId,
                });
        
                const resOnceBook = await axios.get(`/show-history-book/${id}`, { withCredentials: true });
                console.log(resOnceBook.data.history);
                setBook(resOnceBook.data.history || {});
            } catch (error) {
                console.error("User not authenticated", error);
                navigate("/"); // ถ้าไม่มี Token ให้กลับไปหน้า Login
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [id, navigate]);

    const statusSteps = [
        { key: "pending", label: "รอดำเนินการ" },
        { key: "waiting_delivery", label: "กำลังรอจัดส่งสินค้า" },
        { key: "shipped", label: "จัดส่งแล้ว" },
        { key: "delivered", label: "ส่งสินค้าเรียบร้อย" },
    ];

    if (loading) {
        return (
            <div className="bg-[#F5F5F5] min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="bg-[#F5F5F5] min-h-screen pb-10">
            <div className="container mx-auto px-6 md:px-30 pt-35">
                <div className="w-full bg-white rounded-lg shadow-md p-6 h-auto flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/2 flex justify-center items-center flex-col">
                        <h1 className="text-lg font-semibold text-center mb-4">รายละเอียดหนังสือ</h1>
                        <h2 className="text-base font-medium text-center mb-2">ชื่อหนังสือ: {book.titleBook}</h2>
                        <h2 className="text-base font-semibold text-center mb-4 text-blue-600">ราคา: {book.price} บาท</h2>
                        <img className="w-50 h-70 shadow-2xl rounded-xl object-cover" src={getImageUrl(book.bookPic)} alt="หนังสือ" />
                    </div>

                    <div className="w-full md:w-1/2 flex mt-auto mb-auto justify-center">
                        <ul className="timeline timeline-vertical">
                            {statusSteps.map((step, index) => {
                                const currentStatusIndex = statusSteps.findIndex(s => s.key === book.delivery_status);
                                return (
                                    <li key={index} className="flex items-center">
                                        <div className={`timeline-start m-5 text-xl font-bold ${index <= currentStatusIndex ? 'text-green-500' : 'text-gray-400'}`}>
                                            {index + 1}
                                        </div>

                                        <div className="timeline-middle">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className={`h-10 w-10 ${index <= currentStatusIndex ? 'text-green-500' : 'text-gray-400'}`}
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>

                                        <div className={`timeline-end timeline-box text-sm md:text-base m-5 bg-indigo-50 border border-indigo-100 shadow rounded-lg p-2.5 font-semibold ${index <= currentStatusIndex ? 'text-green-700 bg-green-50 border-green-150' : 'text-slate-400'}`}>
                                            {step.label}
                                        </div>
                                        {index < statusSteps.length - 1 && <hr className={index < currentStatusIndex ? 'bg-green-500' : ''} />}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;
