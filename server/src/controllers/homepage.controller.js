import pool from "../config/DB.config.js";
import multer from "multer";
const upload = multer({ dest: 'uploads/' }).single('bookPic');

export const homepage = async(req, res) => {
    res.json({
        message: "Welcome to Homepage",
        user: req.user
    })
}

// แสดงรายชื่อวิชาทั้งหมด
export const getSubjects = async(req, res) => {
    try {

        const [fetchSubjectsAll] = await pool.execute(
            "SELECT * FROM subjects"
        )

        res.status(200).json({
            message: "Show All subjects",
            subjectCode: fetchSubjectsAll
        })

    } catch (error) {
        console.log("Error in add book controller: ",error.message);
        if (!res.headersSent) {
            return res.status(500).json({
                error: error.message || error
            });
        }
    }
}


// แสดงหนังสือที่ได้รับการยืนยันแล้วและไม่ใช่ของตัวเอง
export const showBooks = async(req, res) => {
    try {
        const userId = req.user?.id;

        const [books] = await pool.execute(
            "SELECT * FROM books WHERE status = 'available' AND checkStatusBooks = 'available' AND userId != ?",
            [userId]
        )

        if(books.length === 0) {
            return res.status(404).json({ message: "Books not found" });
        }

        res.status(200).json({
            message: "Show All Books",
            books: books
        })

    } catch (error) {
        console.log("Error in showBooks: ", error.message);
        res.status(500).json({
            error: error.message || "Error fetching books"
        });
    }
}

// แสดงหนังสือที่ยังไม่ได้รับการยืนยันสำหรับ Admin
export const showBooksUnavailable = async(req, res) => {

    try {
        const [books] = await pool.execute(
            "SELECT * FROM books WHERE checkStatusBooks = 'unavailable'"
        )
        console.log("Database Query Result:", books);

        res.status(200).json({
            message: "Show All Books are unavailable",
            books: books
        })
    } catch (error) {
        console.error("Error controller showBooksUnavailable: ", error.message);
        res.status(500).json({
            error: error.message || "Error fetching books"
        })
    }

}

// แสดงรายละเอียดหนังสือของแต่ละเล่มโดยมีการเชื่อมโยงกับตาราง subjects
export const showDetailBook = async(req, res) => {
    const bookId = req.params.id

    try {

        const [result] = await pool.execute(
            "SELECT b.*, s.subjectCode FROM books AS b INNER JOIN subjects AS s ON b.subjectId = s.id WHERE b.id = ?",
            [bookId]
        )  

        res.status(200).json({
            message: "Selected one book!",
            book: result[0]
        })

    } catch (error) {
        console.log("Error in show detail book: ", error.message);
        res.status(500).json({
            error: error.message || "Error fetch one book"
        })
    }
}

// แสดงสินค้าสำหรับ User คนนั้นๆด้วย userId ที่ลงขาย
export const showUserBooks = async(req, res) => {
    try {

        const userId = req.user?.id;

        const [books] = await pool.execute(
            "SELECT * FROM books WHERE userId = ?",
            [userId]
        )

        if(books.length === 0) {
            return res.status(404).json({ message: "Books not found" });
        }

        res.status(200).json({
            message: "Show All Books",
            books: books
        })

    } catch (error) {
        console.log("Error in showUserBooks Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error fetching books"
        })
    }
}

// แสดงหนังสือที่เลือกและของ user คนนั้นๆ โดยใช้ userId และ bookId
export const showBookWithId = async(req, res) => {
    try {
        
        const bookId = req.params.id;

        const [books] = await pool.execute(
            "SELECT * FROM books WHERE id = ?",
            [bookId]
        )

        if(books.length === 0) {
            return res.status(404).json({ message: "Books not found" });
        }

        res.status(200).json({
            message: "Show Book with Id it table",
            books: books[0]
        })

    } catch (error) {
        
        console.log("Error in showBookWithId Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error fetching books"
        })
        
    }
}

export const showHistory = async(req, res) => {
    try {
        
        const userId = req.user?.id

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
        )

        return res.status(200).json({
            message:"Fetech History",
            books: history
        })

    } catch (error) {
        console.error("Error Show History Controller: ", error.message)
        return res.status(500).json({
            message: error.message
        })
    }
}

export const showHistoryOrders = async(req, res) => {
    try {
        const userId = req.user?.id

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
        )

        if(result) {
            return res.status(200).json({
                message: "Show History Orders",
                historyOrder: result
            })
        }
    } catch (error) {
        console.error("Error Show History Orders Controller: ", error.message)
        return res.status(500).json({
            message: error.message
        })
    }
}

export const searchKeyword = async(req, res) => {
    try {
        const {book} = req.query || ""

        const [search] = await pool.execute(
            "SELECT * FROM books WHERE status = 'available' AND titleBook LIKE ?",
            [`%${book}%`]
        )

        return res.status(200).json({
            message: `Search keyword ${book}`,
            books: search
        })
    } catch (error) {
        console.error("Error Search keyword controller: ", error.message)
        return res.status(500).json({
            message: error.message
        })
    }
}
