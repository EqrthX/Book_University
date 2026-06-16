import request from 'supertest';
import express from 'express';
import homepageRouter from '../src/routes/homepage.route.js';
import pool from '../src/config/DB.config.js';

const app = express();
app.use(express.json());

// Mock Middleware to simulate logged-in user
app.use('/api', (req, res, next) => {
    req.user = { id: 4 }; // Assuming an ID of a logged-in user
    next();
}, homepageRouter);

describe('Homepage API', () => {
    it('ควรเข้าสู่หน้า Homepage ได้สำเร็จ', async () => {
        const res = await request(app).get('/api/homepage');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Welcome to Homepage");
        expect(res.body.user).toEqual({ id: 4 });
    });

    it('ควรแสดงรายชื่อวิชาทั้งหมด (เป็น Array)', async () => {
        const res = await request(app).get('/api/get-subjects');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Show All subjects");
        expect(Array.isArray(res.body.subjectCode)).toBe(true);
    });
});

afterAll(async () => {
    // Close the database pool to ensure Jest can exit gracefully
    await pool.end();
});
