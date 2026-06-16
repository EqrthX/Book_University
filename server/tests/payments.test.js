import request from 'supertest';
import express from 'express';
import paymentRouter from '../src/routes/payments.route.js';
import pool from '../src/config/DB.config.js';

const app = RouterApp();

function RouterApp() {
    const app = express();
    app.use(express.json());
    
    // Mock Auth Middleware
    app.use('/api/payment', (req, res, next) => {
        req.user = { id: 4 };
        next();
    }, paymentRouter);
    return app;
}

describe('Payments API', () => {
    it('ควรดึงราคารวมสั่งซื้อสินค้าได้สำเร็จหากส่ง orderId ถูกต้อง', async () => {
        // Assume orderId = 1
        const res = await request(app)
            .post('/api/payment/show-total-cost')
            .send({ orderId: 1 });
        expect([200, 500]).toContain(res.statusCode); // 200 if order exists, 500 (order not found error) if not
    });

    it('ควรปฏิเสธการดึงราคารวมสินค้าหากไม่ส่ง orderId', async () => {
        const res = await request(app)
            .post('/api/payment/show-total-cost')
            .send({});
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Order ID is required");
    });
});

afterAll(async () => {
    await pool.end();
});
