import { Book } from "../models/index.js";
import { Op } from "sequelize";

// ดึงหนังสือทั้งหมด
export const getAllAvailableBooks = async (userId, limit = 50, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 50);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    return await Book.findAll({
        where: {
            status: 'available',
            checkStatusBooks: 'available',
            userId: { [Op.ne]: userId }
        },
        limit: lim,
        offset: off,
        raw: true
    });
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

    const book = await Book.create({
        titleBook,
        price,
        description: description || "",
        canMeet: canMeetValue,
        contactInfo: contactInfo || null,
        bookPic: bookPic || null,
        subjectId,
        userId
    });

    return book.get({ plain: true });
};

// ดึงข้อมูลหนังสือตามไอดี
export const getBookById = async (bookId) => {
    const book = await Book.findByPk(bookId);

    if (!book) {
        const error = new Error("Book not found");
        error.statusCode = 404;
        throw error;
    }

    return book.get({ plain: true });
};

// อัพเดทข้อมูลหนังสือ (พร้อม Ownership check)
export const updateBook = async (bookId, bookData, userId, userRole) => {
    const existingBook = await Book.findByPk(bookId);

    if (!existingBook) {
        const error = new Error("Book not found");
        error.statusCode = 404;
        throw error;
    }

    if (existingBook.userId !== Number(userId) && userRole !== "admin") {
        const error = new Error("Forbidden: You do not own this book");
        error.statusCode = 403;
        throw error;
    }

    const { titleBook, price, description, canMeet, contactInfo, subjectId } = bookData;
    const canMeetValue = canMeet === "yes" ? "yes" : "no";

    await existingBook.update({
        titleBook,
        price,
        description: description || "",
        canMeet: canMeetValue,
        contactInfo: contactInfo || null,
        subjectId
    });

    return { id: bookId, ...bookData };
};

// ลบหนังสือ (พร้อม Ownership check)
export const deleteBook = async (bookId, userId, userRole) => {
    const existingBook = await Book.findByPk(bookId);

    if (!existingBook) {
        const error = new Error("Book not found");
        error.statusCode = 404;
        throw error;
    }

    if (existingBook.userId !== Number(userId) && userRole !== "admin") {
        const error = new Error("Forbidden: You do not own this book");
        error.statusCode = 403;
        throw error;
    }

    await existingBook.destroy();

    return { bookId };
};

// ค้นหาหนังสือ
export const searchBooks = async (keyword, userId, limit = 50, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 50);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    return await Book.findAll({
        where: {
            [Op.or]: [
                { titleBook: { [Op.like]: `%${keyword}%` } },
                { description: { [Op.like]: `%${keyword}%` } }
            ],
            status: 'available',
            checkStatusBooks: 'available',
            userId: { [Op.ne]: userId }
        },
        limit: lim,
        offset: off,
        raw: true
    });
};

