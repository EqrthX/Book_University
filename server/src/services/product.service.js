import pool from "../config/DB.config.js";

// ดึงหนังสือทั้งหมด
export const getAllAvailableBooks = async (userId) => {
    const [books] = await pool.execute(
        "SELECT * FROM books WHERE status = 'available' AND checkStatusBooks = 'available' AND userId != ?",
        [userId]
    );

    if (books.length === 0) {
        throw new Error("Books not found");
    }

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
        throw new Error("Missing required fields");
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
        throw new Error("Book not found");
    }

    return books[0];
};

// อัพเดทข้อมูลหนังสือ
export const updateBook = async (bookId, bookData) => {
    const { titleBook, price, description, canMeet, contactInfo, subjectId } = bookData;

    const canMeetValue = canMeet === "yes" ? "yes" : "no";

    const [result] = await pool.execute(
        "UPDATE books SET titleBook = ?, price = ?, description = ?, canMeet = ?, contactInfo = ?, subjectId = ? WHERE id = ?",
        [titleBook, price, description || "", canMeetValue, contactInfo || null, subjectId, bookId]
    );

    if (result.affectedRows === 0) {
        throw new Error("Book not found or update failed");
    }

    return { id: bookId, ...bookData };
};

// ลบหนังสือ
export const deleteBook = async (bookId) => {
    const [result] = await pool.execute(
        "DELETE FROM books WHERE id = ?",
        [bookId]
    );

    if (result.affectedRows === 0) {
        throw new Error("Book not found");
    }

    return { bookId };
};

// ค้นหาหนังสือ
export const searchBooks = async (keyword, userId) => {
    const [books] = await pool.execute(
        "SELECT * FROM books WHERE (titleBook LIKE ? OR description LIKE ?) AND status = 'available' AND checkStatusBooks = 'available' AND userId != ?",
        [`%${keyword}%`, `%${keyword}%`, userId]
    );

    return books;
};
