import request from 'supertest';
import express from 'express';
import messagesRouter from '../src/routes/messages.route.js';
import pool from '../src/config/DB.config.js';

const app = express();
app.use(express.json());

// Mock Auth Middleware
app.use('/api/messages', (req, res, next) => {
    req.user = { id: 4 };
    next();
}, messagesRouter);

describe('Messages API', () => {
    it('ควรแสดงรายชื่อผู้ใช้งานทั้งหมดเพื่อใช้แชท', async () => {
        const res = await request(app).get('/api/messages/show-all-users');
        expect([200, 404]).toContain(res.statusCode);
    });

    it('ควรปฏิเสธการส่งข้อความหากส่งข้อมูลไม่ครบ', async () => {
        const res = await request(app)
            .post('/api/messages/send')
            .send({ sender: 4 }); // missing receiver and text/picture
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("ไม่พบข้อมูล");
    });

    it('ควรดึงข้อความระหว่างผู้ใช้งานสำเร็จ', async () => {
        const res = await request(app).get('/api/messages/4/5');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("แสดงข้อความทั้งหมด");
        expect(Array.isArray(res.body.messages)).toBe(true);
    });
});

afterAll(async () => {
    await pool.end();
});
