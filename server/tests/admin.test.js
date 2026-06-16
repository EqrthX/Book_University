import request from 'supertest';
import express from 'express';
import adminRouter from '../src/routes/admin.route.js';
import pool from '../src/config/DB.config.js';

const app = express();
app.use(express.json());

// Mock Auth Middleware
app.use('/api/admin', (req, res, next) => {
    req.user = { id: 4, role: 'admin' };
    next();
}, adminRouter);

describe('Admin API', () => {
    it('ควรดึงรายชื่อหนังสือที่ไม่พร้อมใช้งานสำเร็จ', async () => {
        const res = await request(app).get('/api/admin/show-books-unavailable');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Show All Books are unavailable");
        expect(Array.isArray(res.body.books)).toBe(true);
    });

    it('ควรดึงสถานะการชำระเงินสำเร็จ', async () => {
        const res = await request(app).get('/api/admin/show-status-payment');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Fetch statusPayment Successfully");
        expect(Array.isArray(res.body.statusPayment)).toBe(true);
    });

    it('ควรปฏิเสธการดึงข้อมูลคำสั่งซื้อหากไม่พบรหัสธุรกรรม', async () => {
        const res = await request(app).get('/api/admin/show-information/invalid_id');
        expect(res.statusCode).toBe(500); // Throws Error in service
    });
});

afterAll(async () => {
    await pool.end();
});
