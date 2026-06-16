import pool from "../config/DB.config.js";

// ดึงหนังสือที่ไม่พร้อมจำหน่าย
export const getUnavailableBooks = async () => {
    const [books] = await pool.execute(
        "SELECT * FROM books WHERE checkStatusBooks = 'unavailable'"
    );
    return books;
};

// ดึงสถานะการชำระเงิน
export const getPaymentStatus = async () => {
    const [statusPayment] = await pool.execute(
        `
        SELECT o.id, o.status, p.* FROM payments AS p 
        INNER JOIN orders as o ON p.order_id = o.id
        ORDER BY p.payment_datetime_new DESC, p.transaction_id ASC
        `
    );
    return statusPayment;
};

// ดึงข้อมูลรายละเอียดของคำสั่งซื้อ
export const getOrderInformation = async (transactionId) => {
    if (!transactionId) {
        throw new Error("ไม่พบรหัสธุรกรรม");
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
        [transactionId]
    );

    if (orderResult.length === 0) {
        throw new Error("ไม่พบข้อมูลสำหรับรหัสธุรกรรมที่ระบุ");
    }

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

    const enrichedBooks = orderResult.map((book) => {
        const seller = sellerResults.find((seller) => seller.book_id === book.book_id);
        return {
            ...book,
            seller: seller || null,
        };
    });

    return {
        information: enrichedBooks[0],
        books: enrichedBooks.map((book) => ({
            book_id: book.book_id,
            book_titleBook: book.book_titleBook,
            book_price: book.book_price,
            book_bookPic: book.book_bookPic,
        })),
    };
};

// อัพเดทสถานะคำสั่งซื้อ
export const updateOrderStatus = async (transactionId, status, titleMessage = null, message = null) => {
    const [resultOrderStatus] = await pool.execute(
        `
        UPDATE orders o
        JOIN payments p ON p.order_id = o.id
        SET o.status = ?
        WHERE p.transaction_id = ?
        `,
        [status, transactionId]
    );

    if (resultOrderStatus.affectedRows === 0) {
        throw new Error("ไม่พบคำสั่งซื้อหรือสถานะไม่ได้รับการอัพเดต");
    }

    const [updatedOrder] = await pool.execute(
        "SELECT o.status, o.id FROM orders o JOIN payments p ON p.order_id = o.id WHERE p.transaction_id = ?",
        [transactionId]
    );

    // ถ้าสถานะเป็น completed
    if (status === "completed") {
        await completeOrder(transactionId, updatedOrder[0].id, titleMessage, message);
    }
    // ถ้าสถานะเป็น Not_Approved
    else if (status === "Not_Approved") {
        await rejectOrder(transactionId, updatedOrder[0].id, titleMessage, message);
    }

    return updatedOrder[0]?.status || "unknown";
};

// สมบูรณ์คำสั่งซื้อ
const completeOrder = async (transactionId, orderId, titleMessage = null, message = null) => {
    const finalTitle = titleMessage || "การสั่งซื้อของคุณเสร็จสมบูรณ์";
    const finalMessage = message || "ขอบคุณสำหรับการสั่งซื้อของคุณ!";

    const [orderItems] = await pool.execute(
        `
        SELECT b.*, o.user_id AS buyerId
        FROM order_items oi
        INNER JOIN books b ON b.id = oi.book_id
        INNER JOIN orders o ON o.id = oi.order_id
        WHERE o.id = ?
        `,
        [orderId]
    );

    for (const book of orderItems) {
        await pool.execute(
            `
            INSERT INTO sold_books (book_id, titleBook, price, description, bookPic, userId, buyerId)
            VALUES(?, ?, ?, ?, ?, ?, ?)
            `,
            [
                book.id,
                book.titleBook,
                book.price + 40,
                book.description,
                book.bookPic,
                book.userId,
                book.buyerId,
            ]
        );

        await pool.execute(
            "UPDATE books SET status = 'sold', quantity = 0 WHERE id = ?",
            [book.id]
        );

        await pool.execute(
            "DELETE FROM cart WHERE bookId = ? AND userId = ?",
            [book.id, book.buyerId]
        );
    }

    const [orderInfo] = await pool.execute(
        "SELECT * FROM orders WHERE id = ?",
        [orderId]
    );

    if (orderInfo.length === 0) {
        throw new Error("ไม่พบข้อมูลการสั่งซื้อ");
    }

    const buyerId = orderInfo[0].user_id;

    await pool.execute(
        `
        INSERT INTO notifications (user_id, Title_message, message, status, order_id) 
        VALUES(?, ?, ?, ?, ?)
        `,
        [buyerId, finalTitle, finalMessage, "unread", orderId]
    );
};

// ปฏิเสธคำสั่งซื้อ
const rejectOrder = async (transactionId, orderId, titleMessage = null, message = null) => {
    const finalTitle = titleMessage || "การสั่งซื้อของคุณไม่ได้รับการอนุมัติ";
    const finalMessage = message || "กรุณาติดต่อฝ่ายสนับสนุนสำหรับข้อมูลเพิ่มเติม";

    const [orderInfo] = await pool.execute(
        "SELECT * FROM orders WHERE id = ?",
        [orderId]
    );

    if (orderInfo.length === 0) {
        throw new Error("ไม่พบข้อมูลการสั่งซื้อ");
    }

    const buyerId = orderInfo[0].user_id;

    await pool.execute(
        `
        INSERT INTO notifications (user_id, Title_message, message, status, order_id) 
        VALUES(?, ?, ?, ?, ?)
        `,
        [buyerId, finalTitle, finalMessage, "unread", orderId]
    );
};

// อัพเดทสถานะหนังสือ
export const updateBookStatus = async (bookId) => {
    const [result] = await pool.execute(
        "UPDATE books SET checkStatusBooks = 'available' WHERE id = ?",
        [bookId]
    );

    if (result.affectedRows === 0) {
        throw new Error("Book not found or already updated");
    }

    return { bookId };
};
