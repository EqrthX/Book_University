import pool from "../config/DB.config.js";

// แสดงรายชื่อวิชาทั้งหมด
export const getAllSubjects = async () => {
    const [fetchSubjectsAll] = await pool.execute(
        "SELECT * FROM subjects"
    );
    return fetchSubjectsAll;
};

// แสดงหนังสือที่ได้รับการยืนยันแล้วและไม่ใช่ของตัวเอง
export const getAvailableBooksExcludingUser = async (userId) => {
    const [books] = await pool.execute(
        "SELECT * FROM books WHERE status = 'available' AND checkStatusBooks = 'available' AND userId != ?",
        [userId]
    );
    return books;
};

// แสดงหนังสือที่ยังไม่ได้รับการยืนยันสำหรับ Admin
export const getUnavailableBooks = async () => {
    const [books] = await pool.execute(
        "SELECT * FROM books WHERE checkStatusBooks = 'unavailable'"
    );
    return books;
};

// แสดงรายละเอียดหนังสือของแต่ละเล่มโดยมีการเชื่อมโยงกับตาราง subjects
export const getBookDetails = async (bookId) => {
    const [result] = await pool.execute(
        "SELECT b.*, s.subjectCode FROM books AS b INNER JOIN subjects AS s ON b.subjectId = s.id WHERE b.id = ?",
        [bookId]
    );
    return result[0];
};

// แสดงสินค้าสำหรับ User คนนั้นๆด้วย userId ที่ลงขาย
export const getUserBooks = async (userId) => {
    const [books] = await pool.execute(
        "SELECT * FROM books WHERE userId = ?",
        [userId]
    );
    return books;
};

// แสดงหนังสือที่เลือกและของ user คนนั้นๆ โดยใช้ userId และ bookId
export const getBookById = async (bookId) => {
    const [books] = await pool.execute(
        "SELECT * FROM books WHERE id = ?",
        [bookId]
    );
    return books[0];
};

// แสดงประวัติคำสั่งซื้อ
export const getCompletedOrderHistory = async (userId) => {
    const [history] = await pool.execute(
        `
        SELECT
            users.id AS id,

            orders.id AS order_id,
            orders.user_id AS user_id,
            orders.type AS type,
            orders.status AS status,
            orders.delivery_status AS delivery_status,

            books.id AS bookId,
            books.titleBook AS titleBook,
            books.description AS description,
            books.price AS price,
            books.bookPic AS bookPic,

            order_items.book_id AS book_id

        FROM users
        INNER JOIN orders ON orders.user_id = users.id
        INNER JOIN order_items ON order_items.order_id = orders.id
        INNER JOIN books ON books.id = order_items.book_id
        WHERE orders.status = 'completed' AND orders.user_id = ?
        `,
        [userId]
    );
    return history;
};

// แสดงประวัติคำสั่งซื้อแบบละเอียด (address, pickup, payment, books)
export const getCompletedOrderDetails = async (userId) => {
    const [result] = await pool.execute(
        `
        SELECT  
            users.id AS id,
            
            orders.id AS order_id,
            orders.user_id AS user_id,
            orders.type AS type,
            orders.status AS status,
            
            addresses.order_id AS Address_order_id,
            addresses.full_name AS Address_full_name,
            addresses.house_no AS house_no,
            addresses.street AS street,
            addresses.zone AS zone,
            addresses.subdistrict AS subdistrict,
            addresses.district AS district,
            addresses.province AS province,
            addresses.zip_code AS zip_code,
            addresses.email AS Address_email,

            pickups.order_id AS pickup_order_id,
            pickups.full_name AS fullName,
            pickups.pickup_datetime AS pickup_datetime,
            pickups.location AS location,
            pickups.email AS email,

            payments.order_id AS p_order_id,    
            payments.payment_method AS payment_method,
            payments.payment_datetime AS payment_datetime,

            order_items.book_id AS book_id,
            books.id AS bookId,
            books.bookPic AS bookPic,
            books.titleBook AS titleBook

        FROM users
        INNER JOIN orders ON orders.user_id = users.id
        LEFT JOIN addresses ON addresses.order_id = orders.id
        LEFT JOIN pickups ON pickups.order_id = orders.id
        INNER JOIN payments ON payments.order_id = orders.id
        INNER JOIN order_items ON order_items.order_id = orders.id
        INNER JOIN books ON books.id = order_items.book_id
        WHERE orders.status = 'completed' AND users.id = ?
        `,
        [userId]
    );
    return result;
};

// ค้นหาหนังสือจาก Keyword
export const searchBooksByKeyword = async (bookKeyword) => {
    const [search] = await pool.execute(
        "SELECT * FROM books WHERE status = 'available' AND titleBook LIKE ?",
        [`%${bookKeyword}%`]
    );
    return search;
};

// แสดงประวัติการซื้อของหนังสือเฉพาะเล่ม
export const getBookPurchaseHistory = async (bookId) => {
    const [history] = await pool.execute(
        `
            SELECT 
                sold_books.book_id AS book_id,
                sold_books.titleBook AS titleBook,
                sold_books.price AS price,
                sold_books.bookPic AS bookPic,
                sold_books.buyerId AS buyerId,

                orders.user_id AS user_id,
                orders.delivery_status AS delivery_status

            FROM sold_books 
            INNER JOIN orders ON sold_books.buyerId = orders.user_id
            WHERE sold_books.book_id = ?
        `,
        [bookId]
    );
    return history;
};
