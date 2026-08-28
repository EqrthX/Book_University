import pool from "../config/DB.config.js";

// ดึงหนังสือทั้งหมด
export const getAllAvailableBooks = async (userId, limit = 50, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 50);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    const [books] = await pool.query(
        "SELECT * FROM books WHERE status = 'available' AND checkStatusBooks = 'available' AND userId != ? LIMIT ? OFFSET ?",
        [userId, lim, off]
    );

    return books;
};

// เพิ่มหนังสือใหม่
export const addNewBook = async (bookData) => {
    const {
        titleBook,
        price,
        description,
        canMeet,
        contactInfo,
        bookPic,
        subjectId,
        userId
    } = bookData;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!titleBook || !price || !subjectId) {
        const error = new Error("Missing required fields");
        error.statusCode = 400;
        throw error;
    }

    const canMeetValue = canMeet === "yes" ? "yes" : "no";

    const [result] = await pool.execute(
        "INSERT INTO books (titleBook, price, description, canMeet, contactInfo, bookPic, subjectId, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [titleBook, price, description || "", canMeetValue, contactInfo || null, bookPic || null, subjectId, userId]
    );

    return {
        id: result.insertId,
        titleBook,
        price,
        description,
        canMeet: canMeetValue,
        contactInfo,
        bookPic: bookPic || "",
        subjectId
    };
};

// ดึงข้อมูลหนังสือตามไอดี
export const getBookById = async (bookId) => {
    const [books] = await pool.execute(
        "SELECT * FROM books WHERE id = ?",
        [bookId]
    );

    if (books.length === 0) {
        const error = new Error("Book not found");
        error.statusCode = 404;
        throw error;
    }

    return books[0];
};

// อัพเดทข้อมูลหนังสือ (พร้อม Ownership check)
export const updateBook = async (bookId, bookData, userId, userRole) => {
    const existingBook = await getBookById(bookId);

    if (existingBook.userId !== Number(userId) && userRole !== "admin") {
        const error = new Error("Forbidden: You do not own this book");
        error.statusCode = 403;
        throw error;
    }

    const { titleBook, price, description, canMeet, contactInfo, subjectId } = bookData;
    const canMeetValue = canMeet === "yes" ? "yes" : "no";

    const [result] = await pool.execute(
        "UPDATE books SET titleBook = ?, price = ?, description = ?, canMeet = ?, contactInfo = ?, subjectId = ? WHERE id = ?",
        [titleBook, price, description || "", canMeetValue, contactInfo || null, subjectId, bookId]
    );

    if (result.affectedRows === 0) {
        const error = new Error("Book not found or update failed");
        error.statusCode = 404;
        throw error;
    }

    return { id: bookId, ...bookData };
};

// ลบหนังสือ (พร้อม Ownership check)
export const deleteBook = async (bookId, userId, userRole) => {
    const existingBook = await getBookById(bookId);

    if (existingBook.userId !== Number(userId) && userRole !== "admin") {
        const error = new Error("Forbidden: You do not own this book");
        error.statusCode = 403;
        throw error;
    }

    const [result] = await pool.execute(
        "DELETE FROM books WHERE id = ?",
        [bookId]
    );

    if (result.affectedRows === 0) {
        const error = new Error("Book not found");
        error.statusCode = 404;
        throw error;
    }

    return { bookId };
};

// ค้นหาหนังสือ
export const searchBooks = async (keyword, userId, limit = 50, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 50);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    const [books] = await pool.query(
        "SELECT * FROM books WHERE (titleBook LIKE ? OR description LIKE ?) AND status = 'available' AND checkStatusBooks = 'available' AND userId != ? LIMIT ? OFFSET ?",
        [`%${keyword}%`, `%${keyword}%`, userId, lim, off]
    );

    return books;
};
