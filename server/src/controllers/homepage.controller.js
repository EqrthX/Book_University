import pool from "../config/DB.config.js";

export const homepage = async(req, res) => {
    res.json({
        message: "Welcome to Homepage",
        user: req.user
    })
}

export const addBook = async(req, res) => {
    try {
        
        const {titleBook, price, description, canMeet, contactMeet, contactInfo, bookPic, subjectId} = req.body
        const userId = req.user.id;

        if(!userId) {
            return res.status(401).json({
                message: "Unauthorized: Please Login"
            })
        }

        if(canMeet && (!contactMeet || !contactInfo)) {
            return res.status(400).json({
                message: "Please select fill can meet 'Meet' "
            })
        }

        const bookData = [
            titleBook || null,
            price || null,
            description || null,
            canMeet || null,
            contactMeet || null,
            contactInfo || null,
            bookPic || "",
            subjectId || null,
            userId 
        ]

        const [result] = await pool.execute(
            "INSERT INTO books (titleBook, price, description, canMeet, contactMeet, contactInfo, bookPic, subjectId, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            bookData
        );

        res.status(201).json({
            message: "Add Book Successfully",
            book: {
                id: result.insertId,
                titleBook,
                price,
                description,
                canMeet,
                contactMeet,
                contactInfo,
                bookPic: bookPic || "",
                subjectId
            }
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

export const showBooks = async(req, res) => {
    try {
        const [books] = await pool.execute(
            "SELECT * FROM books"
        )

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

export const showDetailBook = async(req, res) => {
    const bookId = req.params.id

    try {

        const [result] = await pool.execute(
            "SELECT * FROM books WHERE id = ?",
            [bookId]
        )

        res.status(200).json({
            message: "Selected one book!",
            book: result
        })

    } catch (error) {
        console.log("Error in show detail book: ", error.message);
        res.status(500).json({
            error: error.message || "Error fetch one book"
        })
    }
}

export const updateBook = async(req, res) => {

    const {titleBook, price, description, canMeet, contactMeet, contactInfo, bookPic, subjectId} = req.body;
    const bookId = req.params.id

    try {

        

        const [result] = await pool.execute(
            "UPDATE books SET titleBook = ?, price = ?, description = ?, canMeet = ?, contactMeet = ?, contactInfo = ?, bookPic = ?, subjectId = ? WHERE id = ?",
            [titleBook, price, description, canMeet, contactMeet, contactInfo, bookPic, subjectId, bookId]
        )
        
        res.status(200).json({
            message: "Book Update Successfully!",
            book: {
                bookId,
                titleBook,
                price,
                description,
                canMeet,
                contactMeet,
                contactInfo,
                bookPic: bookPic || "",
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
        const bookId = req.params.id

        await pool.execute(
            "DELETE FROM books WHERE id = ?",
            [bookId]
        )

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