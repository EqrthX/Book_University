import request from 'supertest';
import express from 'express';
import userRouter from '../src/routers/user.route.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', userRouter);

describe('Authentication API', () => {
    it('ควรคืนค่า 400 หากข้อมูล Signup ไม่ครบ', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({ studentId: "12345" }); // ขาด email, password, fullName
        
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("All fields are required!");
    });
});