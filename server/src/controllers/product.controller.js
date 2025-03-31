import pool from "../config/DB.config.js";
import multer from "multer";

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

export const addBook = async(req, res) => {
    try {
        
            console.log("File uploaded:", req.files );

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
            const bookPic = req.files?.bookPic?.[0]?.path.replace(/\\/g, "/") || null;

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