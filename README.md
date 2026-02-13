# Book University 📚

เว็บแอปพลิเคชันสำหรับซื้อขายแลกเปลี่ยนหนังสือในมหาวิทยาลัย (University Book Marketplace) พัฒนาด้วย JavaScript ทั้งระบบ (Full Stack JavaScript) รองรับการแชทแบบ Real-time และระบบจัดการสินค้าครบวงจร

## 🖼️ ภาพรวมโปรเจกต์ (Project Overview)

Book University เป็นแพลตฟอร์มที่ช่วยให้นักศึกษาสามารถลงขายหนังสือเรียนมือสองหรือค้นหาหนังสือที่ต้องการได้สะดวกยิ่งขึ้น มาพร้อมกับระบบตะกร้าสินค้า ระบบชำระเงิน (แจ้งโอน) และระบบแชทเพื่อพูดคุยระหว่างผู้ซื้อและผู้ขาย

## ✨ ฟีเจอร์หลัก (Features)

### 👤 สำหรับผู้ใช้งานทั่วไป (User)
* **ระบบสมาชิก:** ลงทะเบียน (Sign up), เข้าสู่ระบบ (Login) และจัดการโปรไฟล์
* **ซื้อ-ขายหนังสือ:**
    * ค้นหาหนังสือ (Search)
    * ดูรายละเอียดหนังสือ (Book Detail)
    * เพิ่มหนังสือลงตะกร้า (Add to Cart)
    * สั่งซื้อสินค้า (Order & Buy Now)
    * ลงขายหนังสือของตัวเอง (Add Book) และแก้ไขข้อมูล (Update Book)
* **การชำระเงิน:** อัปโหลดสลิปโอนเงิน (Payment Slip Upload)
* **การสื่อสาร:** ระบบแชท Real-time (Socket.io) ระหว่างผู้ซื้อ-ผู้ขาย
* **ประวัติ:** ดูประวัติการซื้อ (Buy History) และประวัติการขาย (Sell History)
* **การแจ้งเตือน:** ระบบแจ้งเตือนภายในเว็บ (Notifications)

### 🛡️ สำหรับผู้ดูแลระบบ (Admin)
* **Dashboard:** หน้าหลักสำหรับแอดมิน
* **จัดการหนังสือ:** ตรวจสอบรายการหนังสือในระบบ (Check Books)
* **ตรวจสอบการชำระเงิน:** ตรวจสอบสลิปและอนุมัติการชำระเงิน (Check & Verify Payment)
* **จัดการสิทธิ์:** ลงทะเบียนแอดมินใหม่ (Admin Register)

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

### Frontend (Client)
* **Language:** JavaScript (ES6+)
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS, DaisyUI
* **Routing:** React Router DOM
* **HTTP Client:** Axios
* **Real-time:** Socket.io Client
* **Icons:** Lucide React

### Backend (Server)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MySQL (ใช้งานผ่าน `mysql2` และ `sequelize` ในบางส่วน)
* **Authentication:** JWT (JSON Web Tokens)
* **Real-time:** Socket.io
* **File Upload:** Multer (สำหรับรูปภาพหนังสือและสลิป)
* **Security:** Bcryptjs, CORS

## 📂 โครงสร้างโปรเจกต์ (Folder Structure)

```text
Book_University/
├── client/                 # ส่วนของ Frontend (React)
│   ├── src/
│   │   ├── pages/          # หน้าเว็บต่างๆ (User & Admin)
│   │   ├── components/     # Component ย่อย (Navbar, Chat, etc.)
│   │   ├── assets/         # รูปภาพและไฟล์ Static
│   │   └── util/           # Utility functions (axios, socket)
│   └── ...
├── server/                 # ส่วนของ Backend (Express API)
│   ├── src/
│   │   ├── config/         # การตั้งค่า Database (DB.config.js)
│   │   ├── controllers/    # Logic การทำงานของ API
│   │   ├── routers/        # กำหนด Route API
│   │   ├── middleware/     # Auth & Upload Middleware
│   │   └── index.js        # Entry point และ Socket.io Logic
│   ├── uploads/            # โฟลเดอร์เก็บรูปที่อัปโหลด
│   └── ...
└── README.md
```

1. Clone Project
```bash
git clone [https://github.com/EqrthX/Book_University.git](https://github.com/EqrthX/Book_University.git)
cd Book_University
```

2. ตั้งค่า Database (MySQL)
- สร้าง Database ใน MySQL ของคุณ (เช่นชื่อ book_university)
- Import ไฟล์ SQL ที่เตรียมไว้ (ถ้ามี) หรือตรวจสอบไฟล์ server/src/config/book_university.sql เพื่อดูโครงสร้างตาราง
- ตั้งค่าการเชื่อมต่อฐานข้อมูลในไฟล์ .env ของฝั่ง Server

3. ติดตั้งและรัน Backend (Server)
```bash
cd server
npm install
```
สร้างไฟล์ .env ในโฟลเดอร์ server และกำหนดค่าต่างๆ เช่น:
```bash
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=book_university
JWT_SECRET=your_jwt_secret
```
รัน Server:
```bash
npm run dev
# Server จะทำงานที่ http://localhost:5001
```

4. ติดตั้งและรัน Frontend (Client)
เปิด Terminal ใหม่ และเข้าไปที่โฟลเดอร์ client:
```bash
cd client
npm install
```
รัน Client:
```bash
npm run dev
# เว็บไซต์จะทำงานที่ http://localhost:5173 (หรือพอร์ตที่ Vite กำหนด)
```

## API Endpoints (คร่าวๆ)
- POST /api/auth/login - เข้าสู่ระบบ

- POST /api/auth/register - ลงทะเบียน

- GET /api/product - ดึงข้อมูลหนังสือทั้งหมด

- POST /api/cart - จัดการตะกร้าสินค้า

- POST /api/payment - แจ้งชำระเงิน

- GET /api/messages/:roomId - ดึงข้อความแชท
