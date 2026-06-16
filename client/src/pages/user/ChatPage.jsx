import { useEffect, useState, useRef } from 'react';
import socket from "../../util/socket.socket.js";
import axios, { SERVER_URL } from '../../util/axios.js';
import { UserRound, Menu, Handshake, Paperclip, X, Send, MessageSquare } from 'lucide-react';
import { formatTime } from '../../util/helper.js';
import { useAuth } from '../../context/AuthContext.jsx';

const ChatPage = () => {
  const { user, loading } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showUsers, setShowUsers] = useState([]);
  const [nameUser, setNameUser] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [picture, setPicture] = useState(null);
  const messagesEndRef = useRef(null);

  // Register socket and fetch user list when authenticated user is loaded
  useEffect(() => {
    if (user?.id) {
      if (socket.connected) {
        socket.emit("register_user", user.id);
      }

      const handleConnect = () => {
        socket.emit("register_user", user.id);
      };

      socket.on("connect", handleConnect);
      
      const fetchUsers = async () => {
        try {
          const usersRes = await axios.get('/messages/show-all-users', { withCredentials: true });
          setShowUsers(usersRes.data.users || []);
        } catch (error) {
          console.error("Error fetching chat users:", error);
        }
      };
      fetchUsers();

      return () => {
        socket.off("connect", handleConnect);
      };
    }
  }, [user]);

  // Listener for incoming socket messages
  useEffect(() => {
    if (user?.id) {
      socket.on("receive_message", (msg) => {
        if (
          (msg.sender === selectedUser && msg.receiver === user.id) ||
          (msg.sender === user.id && msg.receiver === selectedUser)
        ) {
          setMessages((prev) => [...prev, msg]);
        }
      });

      return () => {
        socket.off("receive_message");
      };
    }
  }, [selectedUser, user]);

  // Fetch chat history between current user and selected user
  useEffect(() => {
    if (selectedUser && user?.id) {
      axios
        .get(`/messages/${user.id}/${selectedUser}`, { withCredentials: true })
        .then((res) => {
          setMessages(res.data.messages || []);
        })
        .catch((err) => {
          console.error("Error fetching message history:", err);
        });
    }
  }, [selectedUser, user]);

  // Scroll to bottom when messages list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() || picture) {
      const newMessage = {
        text: message,
        sender: user.id,
        receiver: selectedUser,
        created_at: new Date().toISOString(),
      };

      const formDataMessage = new FormData();
      formDataMessage.append("text", message);
      formDataMessage.append("sender", user.id);
      formDataMessage.append("receiver", selectedUser);

      if (picture) {
        formDataMessage.append("picture_message", picture);
      }

      try {
        const response = await axios.post("/messages/send", formDataMessage, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        const finalMessage = { ...newMessage, picture: response.data.data.picture };
        
        socket.emit("send_message", finalMessage);
        setMessages((prev) => [...prev, finalMessage]);
      } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
      }

      setMessage("");
      setPicture(null);
    }
  };

  const handleSelectUser = (targetUserId) => {
    const target = showUsers.find((u) => u.id === targetUserId);
    setSelectedUser(targetUserId);
    setNameUser(target ? target.fullName : "");
    setIsMenuOpen(false);
  };

  const handleInputFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="loading loading-spinner loading-lg text-[#2d3695]"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 max-w-6xl pb-10 font-sans text-slate-800">
      
      {/* Outer Box Container with Glassmorphism / Shadows */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl flex flex-col md:flex-row h-[75vh] overflow-hidden">
        
        {/* User List Sidebar */}
        <aside className="w-full md:w-[30%] bg-slate-50 border-r border-slate-100 flex flex-col flex-shrink-0">
          
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="font-extrabold text-sm uppercase tracking-wider text-slate-400 flex items-center">
              <MessageSquare className="w-4 h-4 mr-1.5" />
              กล่องข้อความ
            </span>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* User Rows */}
          <div className={`${isMenuOpen ? "block" : "hidden"} md:block flex-grow overflow-y-auto p-3 space-y-1`}>
            {showUsers.length === 0 ? (
              <div className="text-slate-400 text-center text-xs py-10 font-medium">ไม่มีผู้ใช้งานในขณะนี้</div>
            ) : (
              showUsers.map((target) => {
                const isSelected = selectedUser === target.id;
                const initials = target.fullName.split(" ").map(n => n[0]).join("").toUpperCase();

                return (
                  <div
                    key={target.id}
                    onClick={() => handleSelectUser(target.id)}
                    className={`flex items-center space-x-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/15' 
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {/* Mock Avatar Circle */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      isSelected ? 'bg-white/10 text-white' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {initials}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="font-extrabold text-sm truncate">{target.fullName}</p>
                      <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                        {target.user_role === 'student' ? 'นักศึกษา' : 'ผู้ใช้งาน'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Chat Area Main Column */}
        <section className="flex-1 flex flex-col bg-white h-full relative">
          
          {selectedUser ? (
            <>
              {/* Active User Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm">
                    {nameUser ? nameUser.split(" ").map(n => n[0]).join("").toUpperCase() : "US"}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 leading-none">{nameUser}</h3>
                    <span className="text-[10px] text-emerald-500 font-bold block mt-1.5 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                      กำลังสนทนา
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat Log Message Bubbles */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4 max-h-[calc(75vh-160px)]">
                {messages.map((msg, index) => {
                  const isOwn = msg.sender === user?.id;

                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                    >
                      {/* Bubble */}
                      <div className="max-w-[70%]">
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isOwn
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-blue-500/5"
                              : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50"
                          }`}
                        >
                          {msg.text}
                          {msg.picture && (
                            <img
                              src={`${SERVER_URL}/${msg.picture.replace(/\\/g, "/")}`}
                              alt="Attached evidence"
                              className="mt-2 rounded-lg max-h-48 w-full object-contain cursor-zoom-in"
                              onClick={() => window.open(`${SERVER_URL}/${msg.picture.replace(/\\/g, "/")}`, "_blank")}
                            />
                          )}
                        </div>
                        {/* Timestamp */}
                        <span className="text-[9px] text-slate-400 font-semibold mt-1 block px-1">
                          {msg.created_at ? formatTime(msg.created_at) : ""}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Toolbar Footer */}
              <div className="p-4 border-t border-slate-100 bg-white relative">
                {/* Floating selected image preview */}
                {picture && (
                  <div className="absolute bottom-full left-4 mb-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-xl flex items-center space-x-2 z-20">
                    <img
                      src={URL.createObjectURL(picture)}
                      alt="Upload Preview"
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setPicture(null)}
                      className="p-1 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <form onSubmit={sendMessage} className="flex items-center space-x-3 bg-slate-50 border border-slate-200 rounded-2xl p-2 pl-3">
                  {/* File attach button */}
                  <label
                    htmlFor="fileInput"
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer transition-all flex-shrink-0"
                  >
                    <Paperclip className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleInputFileChange}
                      className="hidden"
                      id="fileInput"
                    />
                  </label>

                  {/* Input field */}
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="พิมพ์ข้อความที่นี่..."
                    className="flex-grow bg-transparent text-sm outline-none text-slate-800 placeholder-slate-400"
                    name="message"
                  />

                  {/* Send button */}
                  <button
                    type="submit"
                    className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md shadow-blue-500/10 active:scale-95 transition-all flex-shrink-0"
                  >
                    <Send className="w-4.5 h-4.5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            // Sidebar Not Selected Empty state
            <div className="flex-grow flex flex-col items-center justify-center p-8 bg-slate-50/20">
              <div className="w-20 h-20 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 animate-pulse">
                <Handshake className="w-10 h-10" />
              </div>
              <h3 className="font-extrabold text-slate-700 text-base">เริ่มการสนทนาใหม่</h3>
              <p className="text-slate-400 text-xs text-center mt-1.5 max-w-xs leading-relaxed">
                กรุณาเลือกผู้ใช้งานในกล่องข้อความทางด้านซ้ายเพื่อเปิดการสนทนาพูดคุยและนัดรับหนังสือเรียน
              </p>
            </div>
          )}

        </section>

      </div>

    </div>
  );
};

export default ChatPage;
