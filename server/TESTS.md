# การเขียนและการทดสอบโค้ด (Unit Testing & Coverage)

เอกสารฉบับนี้อธิบายขั้นตอนการรันการทดสอบ (Unit Tests), การเขียนเทส และการตรวจสอบ Test Coverage สำหรับส่วนของ Server

---

## 1. คำสั่งการทดสอบ (Test Commands)

ในโปรเจกต์นี้เนื่องจากใช้ **ES Modules** (`"type": "module"`) การรัน Jest จำเป็นต้องเปิดใช้งาน experimental VM modules ของ Node.js ซึ่งได้ตั้งค่าคำสั่งไว้ใน `package.json` เรียบร้อยแล้ว:

### การรันการทดสอบทั้งหมด (Run All Tests)
ใช้คำสั่งด้านล่างนี้เพื่อรันเทสปกติ:
```bash
npm run test
```

### การตรวจสอบ Test Coverage (Check Test Coverage)
ใช้คำสั่งนี้เพื่อรันเทสและสร้างรายงานความครอบคลุมของเทส (Code Coverage):
```bash
npm run test:coverage
```
เมื่อรันเสร็จสิ้น จะได้ตารางแสดงเปอร์เซ็นต์ความครอบคลุมของโค้ดในแต่ละไฟล์ และโฟลเดอร์ `coverage/` จะถูกสร้างขึ้นมา ซึ่งสามารถเปิดดูรายงานแบบละเอียดผ่านบราวเซอร์ได้โดยการเปิดไฟล์ `server/coverage/lcov-report/index.html`

---

## 2. วิธีการเขียนเทส (How to Write Tests)

ไฟล์เทสจะเก็บอยู่ในโฟลเดอร์ `server/tests/` โดยมีรูปแบบนามสกุลเป็น `.test.js`

### ตัวอย่างการเขียนเทส (Integration/Unit Test)
เมื่อเราสร้างไฟล์ใหม่ เช่น `tests/example.test.js` ให้ใช้รูปแบบการเขียนดังนี้:

```javascript
import request from 'supertest';
import express from 'express';
import pool from '../src/config/DB.config.js'; // ดึง Database pool มาเพื่อทำการปิดหลังรันเทสจบ
import homepageRouter from '../src/routes/homepage.route.js';

const app = express();
app.use(express.json());

// จำลอง Middleware สำหรับ Auth (ถ้าจำเป็น)
app.use('/api', (req, res, next) => {
    req.user = { id: 4 }; // จำลอง User Login
    next();
}, homepageRouter);

describe('Homepage API Tests', () => {
    it('ควรเข้าสู่หน้า Homepage ได้สำเร็จ', async () => {
        const res = await request(app).get('/api/homepage');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Welcome to Homepage");
    });
});

// สำคัญ: ปิด Connection Pool ของ Database ทุกครั้งหลังรันเทสเสร็จสิ้น เพื่อไม่ให้ Jest ค้าง
afterAll(async () => {
    await pool.end();
});
```

### คำแนะนำการทำ Teardown (Graceful Exit)
* เนื่องจาก Controller และ Service ต่างๆ มีการเชื่อมต่อกับ Database ผ่าน Connection Pool ของ MySQL2 (`pool`)
* หากไม่ปิด Connection Pool หลังรันเทสเสร็จด้วย `afterAll(async () => { await pool.end(); });` กระบวนการทำงานของ Jest จะค้างและไม่ยอมปิดตัวเองโดยอัตโนมัติ

---

## 3. โครงสร้างโฟลเดอร์สำหรับเทส (Folder Structure)

```text
server/
├── package.json
├── src/
│   ├── config/DB.config.js
│   ├── controllers/
│   ├── services/
│   └── routes/
└── tests/
    ├── auth.test.js      # เทสระบบ Authentication
    ├── cart.test.js      # เทสระบบตะกร้าสินค้า
    └── homepage.test.js  # เทสระบบหน้าแรกและข้อมูลวิชา/หนังสือ
```
