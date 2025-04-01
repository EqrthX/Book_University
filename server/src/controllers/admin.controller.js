import pool from "../config/DB.config.js";
import multer from "multer";

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

export const showStatusPayment = async(req, res) => {
    try {

        const [statusPayment] = await pool.execute(
            `
            SELECT o.id, o.status, p.* FROM payments AS p 
            INNER JOIN orders as o ON p.order_id = o.id
            ORDER BY p.payment_datetime_new DESC, p.transaction_id ASC
            `
        )

        return res.status(200).json({
            message: "Fetch statusPayment Successfully",
            statusPayment: statusPayment
        })
    } catch (error) {
        console.error("Error Show Status Payment Controller: ", error)
        return res.status(500).json({
            message:error.message
        })
    }
}

export const fetchInfomation = async(req, res) => {

    try {
        const {id} = req.params;

        if(!id) {
            return res.status(400).json({
                message: "Transaction Id not found"
            })
        } 

        const [orderResult] = await pool.execute(
            `
            SELECT 
                users.id AS user_id, 
                users.fullName AS user_fullName, 
                users.email AS user_email,

                orders.id AS order_id,
                orders.user_id AS order_user_id,
                orders.status AS order_status,
                orders.total_price AS order_totalPrice, 

                order_items.order_id AS order_items_order_id,
                order_items.book_id AS order_items_book_id,
                    
                books.id AS book_id,
                books.titleBook AS book_titleBook,
                books.price AS book_price,
                books.bookPic AS book_bookPic,
                
                payments.* 
            FROM users
            INNER JOIN orders ON users.id = orders.user_id
            INNER JOIN order_items ON order_items.order_id = orders.id
            INNER JOIN books ON books.id = order_items.book_id
            INNER JOIN payments ON payments.order_id = orders.id
            WHERE payments.transaction_id = ?
            `,
            [id]
        )

        if(orderResult.length === 0) {
            return res.status(404).json({
                message: "No information found for the given transaction ID"
            })
        }

        const bookIds = orderResult.map((book) => book.book_id);

        // ดึงข้อมูลผู้ขายสำหรับหนังสือทั้งหมด
        const [sellerResults] = await pool.execute(
            `
            SELECT
                users.id AS seller_id,
                users.fullName AS seller_fullName,
                users.email AS seller_email,
                books.id AS book_id
            FROM users
            INNER JOIN books ON users.id = books.userId
            INNER JOIN order_items ON books.id = order_items.book_id
            WHERE order_items.order_id = ?
            `,
            [orderResult[0].order_id]
        );

        // จับคู่ข้อมูลผู้ขายกับหนังสือ
        const enrichedBooks = orderResult.map((book) => {
            const seller = sellerResults.find((seller) => seller.book_id === book.book_id);
            return {
                ...book,
                seller: seller || null, // ถ้าไม่มีข้อมูลผู้ขาย ให้เป็น null
            };
        });

        // ส่งข้อมูลกลับไปยัง Frontend
        return res.status(200).json({
            message: "Fetch orders successfully",
            infomation: enrichedBooks[0], // ข้อมูลคำสั่งซื้อแรก (ถ้าต้องการ)
            showBooks: enrichedBooks.map((book) => ({
                book_id: book.book_id,
                book_titleBook: book.book_titleBook,
                book_price: book.book_price,
                book_bookPic: book.book_bookPic,
            })),
        });
        
    } catch (error) {
        console.error("Error Fetch Information controller: ", error.message);
        return res.status(500).json({
            error: error.message || "Error fetching information"
        })
    }
}

export const updateOrdersStatus = async(req, res) => {

    try {

        const {id} = req.params;
        const {status} = req.body

        const [resultOrderStatus] = await pool.execute(
            `
            UPDATE orders o
            JOIN payments p ON p.order_id = o.id
            SET o.status = ?
            WHERE p.transaction_id = ?
            `,
            [status, id]
        )

        if(status === "completed"){
            const [orderItems] = await pool.execute(
                `
                SELECT b.*, o.user_id AS buyerId
                FROM order_items oi
                INNER JOIN books b ON b.id = oi.book_id
                INNER JOIN orders o ON o.id = oi.order_id
                WHERE o.id = (SELECT order_id FROM payments WHERE transaction_id = ?)
                `,
                [id]
            )

            for (const book of orderItems) {
                await pool.execute(
                    `
                        INSERT INTO sold_books (book_id, titleBook, price, description, bookPic, userId, buyerId)
                        VALUES(?, ?, ?, ?, ?, ?, ?)
                    `,
                    [
                        book.id,
                        book.titleBook,
                        book.price,
                        book.description,
                        book.bookPic,
                        book.userId,
                        book.buyerId
                    ]
                )

                await pool.execute(
                    "UPDATE books SET status = 'sold', quantity = 0 WHERE id = ?",
                    [book.id]
                );

                await pool.execute(
                    "DELETE FROM cart WHERE bookId = ? AND userId = ?",
                    [book.id, book.buyerId]
                )
            }

        }

        return res.status(200).json({
            message: "อัพเดทสถานะการสั่งซื้อเรียบร้อยแล้ว",
        })

    } catch (error) {
        console.error("Error Update Orders Status Controller: ", error.message)
        return res.status(500).json({
            message: error.message
        })
    }
}

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

