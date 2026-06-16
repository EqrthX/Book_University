import * as productService from "../services/product.service.js";

export const showBooks = async(req, res) => {
    try {
        const userId = req.user?.id;

        const books = await productService.getAllAvailableBooks(userId);

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
}

export const addBook = async(req, res) => {
    try {
        console.log("File uploaded:", req.files);

        const { titleBook, price, description, contactInfo, subjectId } = req.body;
        const userId = req.user?.id;
        const canMeet = req.body.pickUp;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized: Please Login"
            });
        }

        const bookPic = req.files?.bookPic?.[0]?.path.replace(/\\/g, "/") || null;

        const bookData = {
            titleBook,
            price,
            description,
            canMeet,
            contactInfo,
            bookPic,
            subjectId,
            userId
        };

        console.log("📌 Book Data:", bookData);

        const result = await productService.addNewBook(bookData);

        console.log("📌 SQL Result:", result);

        res.status(201).json({
            message: "Add Book Successfully",
            book: result
        });
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
        const { titleBook, price, description, contactInfo, subjectId } = req.body;
        const bookId = req.params.id;
        const canMeet = req.body.pickUp;

        const bookData = { titleBook, price, description, canMeet, contactInfo, subjectId };
        const result = await productService.updateBook(bookId, bookData);

        res.status(200).json({
            message: "Book Update Successfully!",
            book: result
        });
    } catch (error) {
        console.log("Error in updateBook Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error Updating book"
        });
    }
}

export const deleteBook = async (req, res) => {
    try {
        const { bookId } = req.body;

        if (!bookId) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        const result = await productService.deleteBook(bookId);

        res.status(200).json({
            message: "Delete book Successfully!",
            books: result.bookId
        });
    } catch (error) {
        console.log("Error in Delete Book Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error Delete book"
        });
    }
}
