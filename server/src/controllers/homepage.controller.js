import * as homepageService from "../services/homepage.service.js";

export const homepage = async(req, res) => {
    res.json({
        message: "Welcome to Homepage",
        user: req.user
    });
};

// แสดงรายชื่อวิชาทั้งหมด
export const getSubjects = async(req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 100;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : (page - 1) * limit;

        const fetchSubjectsAll = await homepageService.getAllSubjects(limit, offset);

        res.status(200).json({
            message: "Show All subjects",
            subjectCode: fetchSubjectsAll || []
        });
    } catch (error) {
        if (!res.headersSent) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                error: error.message || error
            });
        }
    }
};

// แสดงหนังสือที่ได้รับการยืนยันแล้วและไม่ใช่ของตัวเอง
export const showBooks = async(req, res) => {
    try {
        const userId = req.user?.id;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : (page - 1) * limit;

        const books = await homepageService.getAvailableBooksExcludingUser(userId, limit, offset);

        res.status(200).json({
            message: "Show All Books",
            books: books || []
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            error: error.message || "Error fetching books"
        });
    }
};

// แสดงหนังสือที่ยังไม่ได้รับการยืนยันสำหรับ Admin
export const showBooksUnavailable = async(req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : (page - 1) * limit;

        const books = await homepageService.getUnavailableBooks(limit, offset);

        res.status(200).json({
            message: "Show All Books are unavailable",
            books: books || []
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            error: error.message || "Error fetching books"
        });
    }
};

// แสดงรายละเอียดหนังสือของแต่ละเล่มโดยมีการเชื่อมโยงกับตาราง subjects
export const showDetailBook = async(req, res) => {
    const bookId = req.params.id;

    try {
        const result = await homepageService.getBookDetails(bookId);  

        if (!result) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({
            message: "Selected one book!",
            book: result
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            error: error.message || "Error fetch one book"
        });
    }
};

// แสดงสินค้าสำหรับ User คนนั้นๆด้วย userId ที่ลงขาย
export const showUserBooks = async(req, res) => {
    try {
        const userId = req.user?.id;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : (page - 1) * limit;

        const books = await homepageService.getUserBooks(userId, limit, offset);

        res.status(200).json({
            message: "Show All Books",
            books: books || []
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            error: error.message || "Error fetching books"
        });
    }
};

// แสดงหนังสือที่เลือกและของ user คนนั้นๆ โดยใช้ userId และ bookId
export const showBookWithId = async(req, res) => {
    try {
        const bookId = req.params.id;
        const book = await homepageService.getBookById(bookId);

        if(!book) {
            return res.status(404).json({ message: "Books not found" });
        }

        res.status(200).json({
            message: "Show Book with Id it table",
            books: book
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            error: error.message || "Error fetching books"
        });
    }
};

// แสดงประวัติคำสั่งซื้อ
export const showHistory = async(req, res) => {
    try {
        const userId = req.user?.id;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : (page - 1) * limit;

        const history = await homepageService.getCompletedOrderHistory(userId, limit, offset);

        return res.status(200).json({
            message: "Fetech History",
            books: history || []
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            message: error.message
        });
    }
};

// แสดงประวัติคำสั่งซื้อแบบละเอียด
export const showHistoryOrders = async(req, res) => {
    try {
        const userId = req.user?.id;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : (page - 1) * limit;

        const result = await homepageService.getCompletedOrderDetails(userId, limit, offset);

        return res.status(200).json({
            message: "Show History Orders",
            historyOrder: result || []
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            message: error.message
        });
    }
};

// ค้นหาคำสำคัญ
export const searchKeyword = async(req, res) => {
    try {
        const { book } = req.query || {};
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : (page - 1) * limit;

        const search = await homepageService.searchBooksByKeyword(book || "", limit, offset);

        return res.status(200).json({
            message: `Search keyword ${book || ""}`,
            books: search || []
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            message: error.message
        });
    }
};

// แสดงประวัติการซื้อเฉพาะหนังสือเล่มนั้นๆ
export const showHistoryBook_WithId = async(req, res) => {
    try {
        const bookId = req.params.id;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : (page - 1) * limit;

        const history = await homepageService.getBookPurchaseHistory(bookId, limit, offset);

        return res.status(200).json({
            message: "แสดงประวัติการซื้อหนังสือ: " + bookId,
            history: history[0] || null
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            message: error.message
        });
    }
};
