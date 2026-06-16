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
        const fetchSubjectsAll = await homepageService.getAllSubjects();

        res.status(200).json({
            message: "Show All subjects",
            subjectCode: fetchSubjectsAll
        });
    } catch (error) {
        console.log("Error in getSubjects controller: ", error.message);
        if (!res.headersSent) {
            return res.status(500).json({
                error: error.message || error
            });
        }
    }
};

// แสดงหนังสือที่ได้รับการยืนยันแล้วและไม่ใช่ของตัวเอง
export const showBooks = async(req, res) => {
    try {
        const userId = req.user?.id;
        const books = await homepageService.getAvailableBooksExcludingUser(userId);

        if(books.length === 0) {
            return res.status(404).json({ message: "Books not found" });
        }

        res.status(200).json({
            message: "Show All Books",
            books: books
        });
    } catch (error) {
        console.log("Error in showBooks: ", error.message);
        res.status(500).json({
            error: error.message || "Error fetching books"
        });
    }
};

// แสดงหนังสือที่ยังไม่ได้รับการยืนยันสำหรับ Admin
export const showBooksUnavailable = async(req, res) => {
    try {
        const books = await homepageService.getUnavailableBooks();
        console.log("Database Query Result:", books);

        res.status(200).json({
            message: "Show All Books are unavailable",
            books: books
        });
    } catch (error) {
        console.error("Error controller showBooksUnavailable: ", error.message);
        res.status(500).json({
            error: error.message || "Error fetching books"
        });
    }
};

// แสดงรายละเอียดหนังสือของแต่ละเล่มโดยมีการเชื่อมโยงกับตาราง subjects
export const showDetailBook = async(req, res) => {
    const bookId = req.params.id;

    try {
        const result = await homepageService.getBookDetails(bookId);  

        res.status(200).json({
            message: "Selected one book!",
            book: result
        });
    } catch (error) {
        console.log("Error in show detail book: ", error.message);
        res.status(500).json({
            error: error.message || "Error fetch one book"
        });
    }
};

// แสดงสินค้าสำหรับ User คนนั้นๆด้วย userId ที่ลงขาย
export const showUserBooks = async(req, res) => {
    try {
        const userId = req.user?.id;
        const books = await homepageService.getUserBooks(userId);

        if(books.length === 0) {
            return res.status(404).json({ message: "Books not found" });
        }

        res.status(200).json({
            message: "Show All Books",
            books: books
        });
    } catch (error) {
        console.log("Error in showUserBooks Controller: ", error.message);
        res.status(500).json({
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
        console.log("Error in showBookWithId Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error fetching books"
        });
    }
};

// แสดงประวัติคำสั่งซื้อ
export const showHistory = async(req, res) => {
    try {
        const userId = req.user?.id;
        const history = await homepageService.getCompletedOrderHistory(userId);

        return res.status(200).json({
            message: "Fetech History",
            books: history
        });
    } catch (error) {
        console.error("Error Show History Controller: ", error.message);
        return res.status(500).json({
            message: error.message
        });
    }
};

// แสดงประวัติคำสั่งซื้อแบบละเอียด
export const showHistoryOrders = async(req, res) => {
    try {
        const userId = req.user?.id;
        const result = await homepageService.getCompletedOrderDetails(userId);

        if(result) {
            return res.status(200).json({
                message: "Show History Orders",
                historyOrder: result
            });
        }
    } catch (error) {
        console.error("Error Show History Orders Controller: ", error.message);
        return res.status(500).json({
            message: error.message
        });
    }
};

// ค้นหาคำสำคัญ
export const searchKeyword = async(req, res) => {
    try {
        const {book} = req.query || "";
        const search = await homepageService.searchBooksByKeyword(book);

        return res.status(200).json({
            message: `Search keyword ${book}`,
            books: search
        });
    } catch (error) {
        console.error("Error Search keyword controller: ", error.message);
        return res.status(500).json({
            message: error.message
        });
    }
};

// แสดงประวัติการซื้อเฉพาะหนังสือเล่มนั้นๆ
export const showHistoryBook_WithId = async(req, res) => {
    try {
        const bookId = req.params.id;
        const history = await homepageService.getBookPurchaseHistory(bookId);

        if(history.length === 0) {
            return res.status(404).json({
                message: "ไม่พบข้อมูลการซื้อหนังสือ"
            });
        }

        return res.status(200).json({
            message: "แสดงประวัติการซื้อหนังสือ: " + bookId,
            history: history[0]
        });
    } catch (error) {
        console.error("Error Show History Book With Id Controller: ", error.message);
        return res.status(500).json({
            message: error.message
        });
    }
};
