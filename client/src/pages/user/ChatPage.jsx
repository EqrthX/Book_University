import { useEffect, useState, useRef } from 'react'; // เพิ่ม useRef
import socket from "../../util/socket.socket.js";
import axios from '../../util/axios.js';
import Head from './components/Head.jsx';
import Navdar from './components/Navdar.jsx';
import { UserRound, Menu, Handshake, Upload, X } from 'lucide-react';
import { formatTime } from '../../util/helper.js';

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({
    userId: "",
    studentId: "",
  });

  const [showUsers, setShowUsers] = useState([]);
  const [nameUser, setNameUser] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State สำหรับควบคุมการแสดงเมนู
  const [picture, setPicture] = useState(null); // State สำหรับเก็บไฟล์ภาพที่เลือก
  const messagesEndRef = useRef(null); // สร้าง ref สำหรับตำแหน่งสุดท้ายของข้อความ

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/auth/protected', { withCredentials: true });
        const userId = res.data.user.id;

        setUser({
          userId,
          studentId: res.data.user.studentId,
        });

        // ลงทะเบียน userId กับเซิร์ฟเวอร์ผ่าน socket
        socket.emit("register_user", userId);

        const usersRes = await axios.get('/messages/show-all-users', { withCredentials: true });
        console.log("usersRes:", usersRes.data);
        setShowUsers(usersRes.data.users || []);
      } catch (error) {
        console.error("User not authenticated", error);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      console.log("Received message:", msg);
      if (
        (msg.sender === selectedUser && msg.receiver === user.userId) ||
        (msg.sender === user.userId && msg.receiver === selectedUser)
      ) {
        setMessages((prevMessages) => [...prevMessages, msg]); // อัปเดตข้อความใน UI
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [selectedUser, user.userId]);

  useEffect(() => {
    if (selectedUser) {
      axios
        .get(`/messages/${user.userId}/${selectedUser}`, { withCredentials: true })
        .then((res) => {
          console.log("Fetched old messages:", res.data.messages);
          setMessages(res.data.messages || []); // อัปเดตข้อความใน UI
        })
        .catch((err) => {
          console.error("Error fetching old messages:", err);
        });
    }
  }, [selectedUser, user.userId]);

  // useEffect(() => {
  //   // เลื่อน Scroll ไปยังตำแหน่งล่าสุดเมื่อ messages เปลี่ยนแปลง
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault(); // Prevent page refresh

    if (message.trim() || picture) {
      const newMessage = {
        text: message,
        sender: user.userId, // ID ของผู้ส่ง
        receiver: selectedUser, // ID ของผู้รับ
        created_at: new Date().toISOString(), // เพิ่ม timestamp
      };

      const formDataMessage = new FormData();
      formDataMessage.append("text", message);
      formDataMessage.append("sender", user.userId);
      formDataMessage.append("receiver", selectedUser);

      if (picture) {
        formDataMessage.append("picture_message", picture); // เพิ่มไฟล์ภาพที่เลือก
      }

      console.log("Sending message:", newMessage); // ตรวจสอบข้อความก่อนส่ง
      socket.emit("send_message", { ...newMessage, picture: picture ? "uploaded" : "" }); // ส่งข้อมูล JSON ผ่าน WebSocket

      try {
        const response = await axios.post("/messages/send", formDataMessage, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Server response:", response.data);
        setMessages((prevMessages) => [...prevMessages, { ...newMessage, picture: response.data.data.picture }]); // เพิ่มข้อความใน UI พร้อมรูปภาพ
      } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
      }

      setMessage(""); // Clear the input field after sending
      setPicture(null); // Clear the selected picture
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    }
  };

  const hanleSelectUser = (userId) => {
    const user = showUsers.find((user) => user.id === userId);
    setSelectedUser(userId); // Set the selected user ID
    setNameUser(user.fullName); // Set the selected user's name
    setIsMenuOpen(false); // ปิดเมนูเมื่อเลือกผู้ใช้งาน
  }

  const handleInputFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      console.log("Selected file:", file);
      setPicture(file); // เก็บไฟล์จริงใน state
    }
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col overflow-hidden">
      <Head studentId={user.studentId} />
      <Navdar />

      {/* เพิ่ม padding-top เพื่อเว้นระยะห่างจาก Navbar */}
      <div className="flex justify-center items-center flex-grow px-4 lg:px-0 pt-16 lg:pt-20">
        <div className="bg-gray-500 w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl flex flex-col lg:flex-row rounded-lg shadow-lg overflow-hidden m-auto">
          {/* แสดงรายชื่อ */}
          <div className="lg:w-1/4 bg-gray-700 flex-shrink-0 ">
            <div className="lg:hidden flex items-center justify-between bg-gray-700 text-white p-4">
              <span className="font-bold text-lg">รายชื่อผู้ใช้งาน</span>
              <Menu
                className="cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
            </div>
            <div
              className={`${
                isMenuOpen ? "block" : "hidden"
              } lg:block overflow-y-auto max-h-[calc(100vh-150px)] bg-gray-700`}
            >
              {showUsers.length === 0 && (
                <div className="text-white text-center py-2">ไม่มีผู้ใช้งาน</div>
              )}
              {showUsers.map((user) => (
                <div
                  key={user.id}
                  className="text-white py-2 m-2 sm:m-3 md:m-4 lg:m-5 text-sm sm:text-base md:text-lg"
                  onClick={() => hanleSelectUser(user.id)}
                >
                  <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 w-full h-auto p-1.5 rounded-lg transition-colors hover:bg-gray-500 cursor-pointer">
                    <UserRound />
                    {user.fullName.split(" ")[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-3/4 bg-white flex flex-col min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[550px] max-h-[calc(100vh-100px)]">
            <div className="bg-gray-700 w-full h-11 sm:h-12 md:h-14 lg:h-15 flex">
              <span className="text-white text-base sm:text-lg md:text-xl lg:text-2xl m-auto">
                {nameUser}
              </span>
            </div>
            {!selectedUser && (
              <div className="text-center py-4 text-gray-500 text-sm sm:text-base md:text-lg lg:text-xl animate-bounce m-auto flex flex-col">
                <div className='m-auto'>
                  <Handshake size={100}/>
                </div>
                กรุณาเลือกผู้ใช้งานเพื่อเริ่มการสนทนา
              </div>
            )}
            {selectedUser && (
              <>
                <div className="overflow-y-auto flex-grow p-4 pb-16 max-h-[55vh]">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-2 ${
                        msg.sender === user.userId ? "text-right" : "text-left"
                      }`}
                    >
                      <span
                        className={`inline-block p-2 rounded-lg ${
                          msg.sender === user.userId
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-black"
                        }`}
                        title={msg.created_at ? formatTime(msg.created_at) : ""} // เพิ่ม title attribute
                      > 

                        {msg.text}
                        {/* แสดงรูปภาพถ้ามี */}
                        {msg.picture && (
                          <img
                          src={`http://localhost:5001/${msg.picture}`} // ใช้ msg.picture แทน msg.img
                            alt="Message"
                            className="mt-2 max-h-50 rounded-lg"
                          />
                        )}
                        {/* แสดงเวลา */}
                        

                      </span>
                    </div>
                  ))}
                  {/* เพิ่ม div สำหรับเลื่อน Scroll */}
                  <div ref={messagesEndRef}></div>
                </div>
                <div className="sticky bottom-0 bg-white px-4 ">
                  <form
                    className="flex items-center p-4 border-t"
                    onSubmit={sendMessage}
                  >
                    <label
                      htmlFor="fileInput" 
                      className='mr-3 p-1 rounded-lg hover:bg-gray-300'>
                      <Upload size={32} />
                      <input
                        type="file"
                        accept="image/*, video/*"
                        onChange={handleInputFileChange}
                        className="hidden"
                        id="fileInput"/>
                    </label>
                    
                    {picture && (
                      <div className="absolute top-[-160px] left-5 flex justify-center items-center">
                        <div className="relative w-40 h-40 rounded-lg flex items-center justify-center">
                          <img
                            src={URL.createObjectURL(picture)}
                            alt="Selected"
                            className="w-full h-full object-contain rounded-lg"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 transform translate-x-[50%] translate-y-[-50%] text-red-500 bg-white rounded-full p-1"
                            onClick={() => setPicture(null)}
                          >
                            <X size={24} />
                          </button>
                        </div>
                      </div>
                    )}

                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="พิมพ์ข้อความ..."
                      className="flex-grow p-2 border rounded-lg text-sm sm:text-base md:text-lg"
                      name="message"
                    />
                    <button
                      type="submit"
                      className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-800 text-sm sm:text-base md:text-lg"
                    >
                      ส่ง
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
