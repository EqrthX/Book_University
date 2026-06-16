import request from 'supertest';
import express from 'express';
import notificationRouter from '../src/routes/notification.route.js';
import pool from '../src/config/DB.config.js';

const app = express();
app.use(express.json());

// Mock Auth Middleware
app.use('/api/notifications', (req, res, next) => {
    req.user = { id: 4 };
    next();
}, notificationRouter);

describe('Notification API', () => {
    it('ควรดึงประวัติการแจ้งเตือนของผู้ใช้สำเร็จ', async () => {
        const res = await request(app).get('/api/notifications/getNotifications');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.notifications)).toBe(true);
    });

    it('ควรปฏิเสธการอัปเดตสถานะการแจ้งเตือนหากไม่มี id', async () => {
        const res = await request(app)
            .put('/api/notifications/updateNotificationStatus')
            .send({}); // missing notification id
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("ไม่เจอการแจ้งเตือนนี้");
    });
});

afterAll(async () => {
    await pool.end();
});
