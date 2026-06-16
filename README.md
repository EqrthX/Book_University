# Book University 📚
เว็บแอปพลิเคชันซื้อขายแลกเปลี่ยนหนังสือในมหาวิทยาลัย (University Book Marketplace) พัฒนาด้วย JavaScript ทั้งระบบ (Full Stack JavaScript) มีระบบแชท Real-time และระบบอนุมัติเอกสารการโอนโดยผู้ดูแลระบบแบบเบ็ดเสร็จ

---

## 🖼️ ภาพรวมโปรเจกต์ (Project Overview)
**Book University** เป็นแพลตฟอร์มที่เชื่อมโยงนักศึกษาเพื่อการซื้อขายและแลกเปลี่ยนตำราเรียนมือสองภายในมหาวิทยาลัย ช่วยแก้ปัญหาค่าใช้จ่ายด้านสื่อการเรียนการสอน ตัวระบบรองรับฟังก์ชันการลงขายหนังสือ, ตะกร้าสินค้า, การแจ้งโอนเงินผ่านระบบหลักฐาน (Slip Image Upload), การแชทเพื่อตกลงเงื่อนไขการส่งมอบ และระบบควบคุมดูแล (Admin Approval System) สำหรับแอดมิน เพื่อตรวจสอบความเรียบร้อยของรายการหนังสือและยืนยันยอดเงินที่โอนเข้ามา

---

## ✨ ฟีเจอร์หลัก (Key Features)

### 👤 สำหรับผู้ใช้งานทั่วไป (Student / User)
*   **ระบบสมาชิก (Authentication):** สมัครสมาชิก (Sign up) ด้วยรหัสนักศึกษาและอีเมล และลงชื่อเข้าใช้งาน (Login) พร้อมระบบตรวจสอบสิทธิ์ผ่าน JWT
*   **การจัดการโปรไฟล์ (Profile Management):** จัดการและอัปเดตข้อมูลส่วนตัวของผู้ใช้งาน
*   **ซื้อ-ขายหนังสือ (Marketplace Operations):**
    *   ค้นหาหนังสือ (Search) ตามรหัสวิชาหรือชื่อเรื่อง พร้อมระบบแนะนำหนังสือแยกตามหมวดหมู่/รหัสวิชา
    *   ดูรายละเอียดหนังสือ (Book Detail) ข้อมูลผู้ขาย ราคา รูปภาพ และรายละเอียด
    *   ตะกร้าสินค้า (Shopping Cart) เพิ่ม/ลบหนังสือที่ต้องการ
    *   สั่งซื้อสินค้า (Order & Checkout) รองรับการเลือกประเภทการจัดส่ง (Delivery) หรือนัดรับสินค้า (Pickup)
    *   ลงขายหนังสือ (Add/Update Book) อัปโหลดรูปภาพและกำหนดรายละเอียดหนังสือเพื่อลงประกาศขาย
*   **การชำระเงิน (Payment Workflow):** แนบสลิปและข้อมูลวันเวลาในการทำธุรกรรมโอนเงินผ่านระบบอัปโหลดรูปภาพ (Multer)
*   **แชทสด Real-time (Chat System):** พูดคุยสอบถามข้อมูลกับผู้ซื้อ/ผู้ขายโดยตรงผ่าน WebSockets (Socket.io)
*   **การแจ้งเตือนแบบทันที (Real-time Notifications):** รับข่าวสารอัปเดตสถานะคำสั่งซื้อและการอนุมัติหนังสือจากแอดมิน
*   **ประวัติการทำรายการ (History Logs):** ตรวจสอบประวัติการซื้อ (Buy History) และประวัติการขาย (Sell History)

### 🛡️ สำหรับผู้ดูแลระบบ (Admin)
*   **Dashboard สรุปผล:** ตรวจสอบข้อมูลสถิติเบื้องต้นและภาพรวมของระบบ
*   **ตรวจสอบและอนุมัติหนังสือ (Verify Book Listings):** ตรวจสอบข้อมูลหนังสือที่ผู้ใช้งานลงขาย ก่อนจะอนุญาตให้แสดงบนแพลตฟอร์ม (เปลี่ยนสถานะจาก `unavailable` เป็น `available`)
*   **ตรวจสอบสลิปโอนเงิน (Verify Payments):** ตรวจเช็คข้อมูลสลิปโอนเงินกับรายการสั่งซื้อ เพื่ออนุมัติคำสั่งซื้อ (Completed) หรือปฏิเสธกรณีสลิปมีปัญหา (Not Approved)
*   **ระบบเพิ่มแอดมิน (Admin Provisioning):** ลงทะเบียนเพื่อเพิ่มสิทธิ์ให้ผู้ดูแลระบบรายใหม่ (Admin Register)

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

### Frontend (Client)
*   **Core Library:** React (v19)
*   **Build Tool:** Vite (v6)
*   **Styling:** Tailwind CSS (v4) + DaisyUI (v5) + Lucide React (Icons)
*   **Routing:** React Router DOM (v7)
*   **HTTP Client:** Axios (เชื่อมต่อ REST API)
*   **Real-time Client:** Socket.io Client
*   **State / UI Helpers:** React Hot Toast (แจ้งเตือนความปลอดภัยของ UI), React Confirm Alert

### Backend (Server)
*   **Runtime:** Node.js
*   **Framework:** Express.js (v4)
*   **Database Engine:** MySQL
*   **Database ORM/Query:** Sequelize (v6) & `mysql2` (Connection Pool)
*   **Authentication:** JSON Web Token (JWT) & Bcryptjs (เข้ารหัสผ่าน)
*   **File Upload:** Multer (เก็บรูปภาพหนังสือและสลิปเงินโอนลงเครื่องเซิร์ฟเวอร์)
*   **Real-time Communication:** Socket.io (WebSockets)
*   **Testing Framework:** Jest (v30) & Supertest (v7)

---

## 📂 โครงสร้างโปรเจกต์ (Folder Structure)

```text
Book_University/
├── client/                     # ส่วนของ Frontend (React App)
│   ├── src/
│   │   ├── assets/             # ไฟล์ Static (รูปภาพ, โลโก้)
│   │   ├── components/         # คอมโพเนนต์ที่ใช้ซ้ำ (Navbar, Chat, Layouts)
│   │   ├── features/           # ฟีเจอร์ย่อยของแอปพลิเคชัน (เช่น books, auth)
│   │   ├── pages/              # หน้าเว็บหลักแบ่งตามบทบาทผู้ใช้
│   │   │   ├── admin/          # หน้าสำหรับ Admin (Check Payment, Check Books, Register Admin)
│   │   │   ├── user/           # หน้าสำหรับ User (Home, Details, Chat, Basket, Order, Profile)
│   │   │   ├── LoginPage.jsx   # หน้าลงชื่อเข้าใช้
│   │   │   └── SignupPage.jsx  # หน้าสมัครสมาชิก
│   │   ├── util/               # ฟังก์ชันช่วยเหลือและตั้งค่า API (Axios, Socket)
│   │   ├── main.jsx            # Entry point ของ React
│   │   └── index.css           # สไตล์หลักระดับแอป
│   ├── vite.config.js          # ตั้งค่าการ Build ของ Vite
│   └── package.json            # ไฟล์ระบุ dependencies ของ Client
│
├── server/                     # ส่วนของ Backend (Express API)
│   ├── src/
│   │   ├── config/             # ตั้งค่า DB Connection และ SQL Initial file
│   │   │   ├── DB.config.js    # กำหนด Connection Pool ของ MySQL
│   │   │   ├── app.config.js   # ตั้งค่าแอปพลิเคชันหลัก
│   │   │   └── book_university.sql # ไฟล์สกีมาฐานข้อมูลเริ่มต้น
│   │   ├── controllers/        # ตัวควบคุมประมวลผล Logic ของ Route ต่างๆ
│   │   ├── middleware/         # มิดเดิลแวร์สำหรับความปลอดภัย (JWT Auth, Uploads)
│   │   ├── routes/             # ส่วนกำหนด Path ของ API
│   │   ├── services/           # ฟังก์ชันติดต่อประมวลผลข้อมูลใน Database
│   │   ├── socket/             # ควบคุมการทำงานของ Socket.io (แชทและการแจ้งเตือน)
│   │   ├── app.js              # โครงสร้างหลักของแอป Express
│   │   └── index.js            # ไฟล์ Entry point ของเซิร์ฟเวอร์
│   ├── tests/                  # ชุดคำสั่งการทดสอบระบบ (Jest & Supertest)
│   ├── uploads/                # โฟลเดอร์จัดเก็บรูปภาพอัปโหลด
│   ├── package.json            # ไฟล์ระบุ dependencies ของ Server
│   └── TESTS.md                # คู่มือเกี่ยวกับการรันการทดสอบ Unit Tests
│
└── README.md                   # เอกสารประกอบโครงการ
```

---

## ⚙️ วิธีการติดตั้งและใช้งาน (Installation & Setup)

### 1. โคลนโปรเจกต์ (Clone Project)
```bash
git clone https://github.com/EqrthX/Book_University.git
cd Book_University
```

### 2. ตั้งค่าระบบฐานข้อมูล (Database Setup)
1. ติดตั้ง **MySQL** หรือโปรแกรมจำลองเซิร์ฟเวอร์ฐานข้อมูล (เช่น XAMPP, Laragon, Docker หรือใช้ Cloud SQL เช่น Aiven)
2. สร้าง Database ขึ้นมาใหม่ เช่นตั้งชื่อว่า `book_university`
3. นำเข้า (Import) โครงสร้างตารางและข้อมูลเริ่มต้นจากไฟล์:
   `server/src/config/book_university.sql` ไปยัง Database ที่สร้างไว้

### 3. ติดตั้งและเริ่มรัน Backend Server
เข้าไปที่โฟลเดอร์ `server` และติดตั้ง Packages ทั้งหมด:
```bash
cd server
npm install
```

สร้างไฟล์ `.env` ภายในโฟลเดอร์ `server` แล้วระบุค่าคอนฟิกดังตัวอย่าง:
```env
PORT=5001
DB_PORT=3306
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=รหัสผ่านฐานข้อมูลของคุณ
DB_NAME=book_university
JWT_SECRET=คีย์ลับของคุณสำหรับสร้างโทเค็นความปลอดภัย
REACT_URL=http://localhost:5173
```

เริ่มรันระบบเซิร์ฟเวอร์ในโหมดพัฒนา (Development Mode):
```bash
npm run dev
# เซิร์ฟเวอร์จะเปิดใช้งานที่ http://localhost:5001
```

### 4. ติดตั้งและเริ่มรัน Frontend Client
เปิดเทอร์มินัลใหม่ ไปที่โฟลเดอร์ `client` และติดตั้ง Packages ทั้งหมด:
```bash
cd client
npm install
```

สร้างไฟล์ `.env` ภายในโฟลเดอร์ `client` แล้วระบุค่า Server API URL:
```env
VITE_URL_SERVER=http://localhost:5001/api
```

เริ่มรันระบบ Client ในโหมดพัฒนา:
```bash
npm run dev
# เว็บไซต์จะเปิดใช้งานที่ http://localhost:5173 (หรือพอร์ตอื่นตามที่ Vite แสดง)
```

---

## 🧪 การรันชุดทดสอบ (Automated Testing)
โปรเจกต์นี้มีชุดทดสอบ (Unit Tests / Integration Tests) สำหรับส่วนของ Server โดยใช้เฟรมเวิร์ก Jest และ Supertest สามารถเข้าศึกษาดูวิธีเขียนได้เพิ่มเติมที่ [TESTS.md](file:///c:/Users/Nontprawitch/Desktop/Vs%20code/Javascript/Book_University/server/TESTS.md)

*   **คำสั่งรันเทสปกติ:**
    ```bash
    cd server
    npm run test
    ```
*   **คำสั่งตรวจสอบความครอบคลุมของเทส (Code Coverage):**
    ```bash
    cd server
    npm run test:coverage
    ```
    *เมื่อประมวลผลเสร็จจะมีการสร้างโฟลเดอร์ `coverage/` ขึ้นมา สามารถเปิดไฟล์ `server/coverage/lcov-report/index.html` บนบราวเซอร์เพื่อดูรายงานแบบละเอียดได้*

---

## 🛣️ โครงสร้าง API Endpoints (คร่าวๆ)

ระบบหลังบ้านแบ่งเส้นทางของ API (Routing Paths) ออกเป็นกลุ่มหลักๆ ดังตารางด้านล่าง:

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| **POST** | `/api/auth/register` | ลงทะเบียนนักศึกษาใหม่ | ❌ |
| **POST** | `/api/auth/login` | เข้าสู่ระบบ (รับ JWT Token) | ❌ |
| **GET** | `/api/homepage` | ดึงข้อมูลวิชาและหนังสือเพื่อแสดงหน้าแรก |  |
| **GET** | `/api/product` | ดึงข้อมูลหนังสือที่พร้อมใช้งานทั้งหมด |  |
| **POST** | `/api/product` | ลงทะเบียนหนังสือเล่มใหม่สำหรับขาย |  |
| **PUT** | `/api/product/:id` | แก้ไขข้อมูลหนังสือ |  |
| **DELETE** | `/api/product/:id` | ลบหนังสือออกจากระบบ |  |
| **GET** | `/api/cart` | ดึงหนังสือในตะกร้า |  |
| **POST** | `/api/cart` | เพิ่มหนังสือลงตะกร้า |  |
| **DELETE** | `/api/cart/:id` | ลบหนังสือจากตะกร้า |  |
| **POST** | `/api/payment` | สร้างใบสั่งซื้อและการโอนเงิน (แจ้งยอด) |  |
| **PUT** | `/api/payment` | แนบ/อัปเดตสลิปยืนยันการโอนเงิน |  |
| **GET** | `/api/messages/:roomId` | ดึงประวัติการแชทระหว่างผู้รับ-ผู้ส่ง |  |
| **GET** | `/api/notifications` | ดึงการแจ้งเตือนของตนเอง |  |
| **GET** | `/api/admin/books` | ดึงรายการหนังสือที่รอการอนุมัติ (สำหรับแอดมิน) |  |
| **PUT** | `/api/admin/books/:id` | อนุมัติหนังสือเล่มใหม่ให้แสดงบนระบบ |  |
| **GET** | `/api/admin/payments` | ดึงคำสั่งซื้อและสลิปที่ต้องตรวจสอบ |  |
| **PUT** | `/api/admin/order-status` | อนุมัติ (Completed) หรือปฏิเสธสลิปสั่งซื้อ |  |

---

## 💬 การทำงานแบบ Real-time (Socket.io Connection)
ระบบแชทสดและระบบแจ้งเตือนแบบเรียลไทม์ ใช้ความสามารถของ **WebSocket** ผ่านไลบรารี **Socket.io**
*   **การสนทนา (Chat Messages):** ข้อมูลจะถูกบันทึกลงฐานข้อมูลในตาราง `messages` และส่งกระจายไปยังห้องแชทของคู่สนทนาทันที
*   **การแจ้งเตือน (Live Notifications):** เมื่อแอดมินอนุมัติสลิปโอนเงินหรือมีความเปลี่ยนแปลงเกี่ยวกับคำสั่งซื้อ ระบบจะยิงข้อมูล Event ไปอัปเดตกระดิ่งแจ้งเตือนของผู้ใช้โดยตรงแบบไม่ต้องโหลดหน้าเว็บใหม่
