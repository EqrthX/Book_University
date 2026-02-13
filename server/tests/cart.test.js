import request from 'supertest';
import express from 'express';
import cartRouter from '../src/routers/cart.route.js';

const app = express();
app.use(express.json());

// Mock Middleware เพื่อจำลองว่า User เข้าสู่ระบบแล้ว
app.use('/api/cart', (req, res, next) => {
    req.user = { id: 4 }; // สมมติเป็น ID ของคุณ
    next();
}, cartRouter);

describe('Cart API', () => {
    it('ควรแสดงรายการหนังสือในตะกร้า (เป็น Array)', async () => {
        const res = await request(app).get('/api/cart/show-cart');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.books)).toBe(true);
    });
});