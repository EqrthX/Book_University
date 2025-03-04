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

// เพิ่มหนังสือใหม่สำหรับ User
export const addBook = async(req, res) => {
    try {
        
            console.log("File uploaded:", req.file);

            const {titleBook, price, description, contactInfo, subjectId} = req.body;
            const userId = req.user?.id;
            const canMeet = req.body.pickUp;

            if(!userId) {
                return res.status(401).json({
                    message: "Unauthorized: Please Login"
                });
            }

            if (!titleBook || !price || !subjectId) {
                console.error("❌ Missing required fields:", { titleBook, price, subjectId });
                return res.status(400).json({ message: "Missing required fields" });
            }

            const canMeetValue = canMeet === "yes" ? "yes" : "no";

            // จัดการไฟล์รูปภาพ รับ request.file
            const bookPic = req.file ? req.file.path.replace(/\\/g, "/") : "";

            const bookData = [
                titleBook,
                price,
                description || "",
                canMeetValue,
                contactInfo || null,
                bookPic, //เก็บ path ไฟล์
                subjectId,
                userId
            ];

            console.log("📌 SQL Data:", bookData); // ✅ Debug ค่าที่จะส่งไปยัง Database

            try {
                const [result] = await pool.execute(
                    "INSERT INTO books (titleBook, price, description, canMeet, contactInfo, bookPic, subjectId, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    bookData
                );

                console.log("📌 SQL Result:", result); // ✅ Debug ผลลัพธ์จาก Database

                res.status(201).json({
                    message: "Add Book Successfully",
                    book: {
                        id: result.insertId,
                        titleBook,
                        price,
                        description,
                        canMeet: canMeetValue,
                        contactInfo,
                        bookPic: bookPic || "",
                        subjectId
                    }
                });
            } catch (sqlError) {
                console.error("❌ SQL Error:", sqlError.message);
                return res.status(500).json({
                    message: "Database error",
                    error: sqlError.message
                });
            }
    } catch (error) {
        console.log("Error in add book controller: ", error.message);
        if (!res.headersSent) {
            return res.status(500).json({
                error: error.message || error
            });
        }
    }
};

// เพิ่มสินค้าลงในตะกร้า
export const addToCart = async(req, res) => {

    try {
        const userId = req.user?.id;
        const bookId = req.params.id;

        const [book] = await pool.execute(
            "SELECT id FROM books WHERE id = ?", [bookId]
        )
        
        if(book.length === 0) {
            return res.status(404).json({ message: "Book not found" }); 
        }

        const [result] = await pool.execute(
            "INSERT INTO cart (userId, bookId) VALUES (?, ?)",
            [userId, bookId]
        )

        if(result.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found or already in cart" });
        }

        res.status(201).json({
            message: "Add to Cart Successfully!",
            cart: {
                userId,
                bookId
            }
        })

    } catch (error) {
        console.error("Error in addToCart Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error Adding to Cart"
        })
    }

}

// แสดงหนังสือที่ได้รับการยืนยันแล้วและไม่ใช่ของตัวเอง
export const showBooks = async(req, res) => {
    try {
        const userId = req.user?.id;

        const [books] = await pool.execute(
            "SELECT * FROM books WHERE checkStatusBooks = 'available' AND userId != ?",
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

export const showBookWithCart = async(req, res) => {

    try {
        
        const userId = req.user?.id;

        const [books] = await pool.execute(
            "SELECT c.id AS cartId, b.* FROM books AS b INNER JOIN cart AS c ON b.id = c.bookId WHERE c.userId = ?",
            [userId]
        )

        if(books.length === 0) {
            return res.status(200).json({ message: "Books not found",
                books: []
            });
        }

        res.status(200).json({
            message: "Show Book with Cart",
            books: books
        })

    } catch (error) {
        console.error("Error in showBookWithCart Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error fetching books"
        })
    }

}
// อัปเดตสถานะหนังสือเมื่อ Admin ยืนยัน
export const updateStatusBook = async(req, res) => {
    try {
        const bookId = req.params.id

        const [result] = await pool.execute(
            "UPDATE books SET checkStatusBooks = 'available' WHERE id = ?",
            [bookId]
        )

        if(result.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found or already updated" });
        }

        res.status(200).json({

            message: "Update Status Book Successfully!",
            book: {
                bookId,
                
            }

        })
    } catch (error) {
        console.log("Error in updateStatusBook Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error Updating Status book"
        })
        
    }
}

export const updateBook = async(req, res) => {

    try {
        
        const {titleBook, price, description, contactInfo, subjectId} = req.body;
        const bookId = req.params.id;
        const canMeet = req.body.pickUp;
        
        const [result] = await pool.execute(

            "UPDATE books SET titleBook = ?, price = ?, description = ?, canMeet = ?, contactInfo = ?, subjectId = ? WHERE id = ?",
            [titleBook, price, description, canMeet, contactInfo, subjectId, bookId]
        )

        if(result.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found or already updated" });
        }
        
        res.status(200).json({
            message: "Book Update Successfully!",
            book: {
                bookId,
                titleBook,
                price,
                description,
                canMeet,
                contactInfo,
                subjectId
            }
        })

    } catch (error) {
        console.log("Error in updateBook Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error Updating book"
        })
    }
}

export const deleteBook = async (req, res) => {
    try {
        const {bookId} = req.body

        if(!bookId) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        const [result] = await pool.execute(
            "DELETE FROM books WHERE id = ?",
            [bookId]
        )

        if(result.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found or already deleted" });
        }

        res.status(200).json({
            message: "Delete book Successfully!",
            books: bookId
        })

    } catch (error) {
        console.log("Error in Delete Book Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error Delete book"
        })
    }
}

export const deleteItemCart = async(req, res) => {
    try {
        const cartId = req.params.id;

        const [cart] = await pool.execute(
            "DELETE FROM cart WHERE id = ?",
            [cartId]
        )

        res.status(200).json({
            message: "Delete Item Cart Successfully!",
            cart: cartId
        })


    } catch (error) {
        console.error("Error in deleteItemCart Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error Delete Item Cart"
        })
        
    }
}