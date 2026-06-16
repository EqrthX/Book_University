import request from 'supertest';
import express from 'express';
import productRouter from '../src/routes/product.route.js';
import pool from '../src/config/DB.config.js';

const app = express();
app.use(express.json());

// Mock Auth Middleware
app.use('/api/product', (req, res, next) => {
    req.user = { id: 4 }; // Mock user
    next();
}, productRouter);

describe('Product API', () => {
    it('ควรแสดงรายชื่อหนังสือที่ลงขายทั้งหมดสำหรับ user (ผ่าน route ของ product)', async () => {
        const res = await request(app).get('/api/product/show-books');
        // If not found (404) or found (200), both statuses are valid depending on DB content
        expect([200, 404]).toContain(res.statusCode);
    });

    it('ควรปฏิเสธการลบหนังสือหากไม่มี Book ID', async () => {
        const res = await request(app)
            .delete('/api/product/delete-book')
            .send({});
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Book ID is required");
    });
});

afterAll(async () => {
    await pool.end();
});
