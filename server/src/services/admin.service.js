import { Book, Payment, Order, OrderItem, User, SoldBook, Cart, Notification } from "../models/index.js";
import { Op } from "sequelize";

// ดึงหนังสือที่ไม่พร้อมจำหน่าย
export const getUnavailableBooks = async (limit = 50, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 50);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    return await Book.findAll({
        where: { checkStatusBooks: "unavailable" },
        limit: lim,
        offset: off,
        raw: true
    });
};

// ดึงสถานะการชำระเงิน
export const getPaymentStatus = async (limit = 50, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 50);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    const payments = await Payment.findAll({
        include: [{
            model: Order,
            as: "order",
            attributes: ["id", "status"]
        }],
        order: [
            ["payment_datetime_new", "DESC"],
            ["transaction_id", "ASC"]
        ],
        limit: lim,
        offset: off
    });

    return payments.map(p => {
        const plain = p.get({ plain: true });
        const orderData = plain.order || {};
        delete plain.order;
        return {
            id: orderData.id || null,
            status: orderData.status || null,
            ...plain
        };
    });
};

// ดึงข้อมูลรายละเอียดของคำสั่งซื้อ
export const getOrderInformation = async (transactionId) => {
    if (!transactionId) {
        throw new Error("ไม่พบรหัสธุรกรรม");
    }

    const payment = await Payment.findOne({
        where: { transaction_id: transactionId },
        include: [{
            model: Order,
            as: "order",
            include: [
                { model: User, as: "user" },
                {
                    model: OrderItem,
                    as: "items",
                    include: [{ model: Book, as: "book" }]
                }
            ]
        }]
    });

    if (!payment || !payment.order) {
        throw new Error("ไม่พบข้อมูลสำหรับรหัสธุรกรรมที่ระบุ");
    }

    const order = payment.order;
    const buyer = order.user;

    const bookIds = order.items.map(item => item.book_id);
    
    // ดึงข้อมูลผู้ขายของหนังสือแต่ละเล่มในออเดอร์นี้
    const booksWithSellers = await Book.findAll({
        where: { id: { [Op.in]: bookIds } },
        include: [{
            model: User,
            as: "user"
        }]
    });

    const enrichedBooks = order.items.map(item => {
        const book = item.book ? item.book.get({ plain: true }) : {};
        const bookWithSeller = booksWithSellers.find(b => b.id === item.book_id);
        const seller = bookWithSeller?.user ? bookWithSeller.user.get({ plain: true }) : null;

        const plainPayment = payment.get({ plain: true });
        delete plainPayment.order;

        return {
            user_id: buyer?.id || null,
            user_fullName: buyer?.fullName || null,
            user_email: buyer?.email || null,
            order_id: order.id,
            order_user_id: order.user_id,
            order_status: order.status,
            order_totalPrice: order.total_price,
            order_items_order_id: order.id,
            order_items_book_id: item.book_id,
            book_id: book.id,
            book_titleBook: book.titleBook,
            book_price: book.price,
            book_bookPic: book.bookPic,
            ...plainPayment,
            seller: seller ? {
                seller_id: seller.id,
                seller_fullName: seller.fullName,
                seller_email: seller.email,
                book_id: book.id
            } : null
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
    const payment = await Payment.findOne({
        where: { transaction_id: transactionId },
        include: [{
            model: Order,
            as: "order"
        }]
    });

    if (!payment || !payment.order) {
        throw new Error("ไม่พบคำสั่งซื้อหรือสถานะไม่ได้รับการอัพเดต");
    }

    await payment.order.update({ status });

    // ถ้าสถานะเป็น completed
    if (status === "completed") {
        await completeOrder(transactionId, payment.order_id, titleMessage, message);
    }
    // ถ้าสถานะเป็น Not_Approved
    else if (status === "Not_Approved") {
        await rejectOrder(transactionId, payment.order_id, titleMessage, message);
    }

    return payment.order.status;
};

// สมบูรณ์คำสั่งซื้อ
const completeOrder = async (transactionId, orderId, titleMessage = null, message = null) => {
    const finalTitle = titleMessage || "การสั่งซื้อของคุณเสร็จสมบูรณ์";
    const finalMessage = message || "ขอบคุณสำหรับการสั่งซื้อของคุณ!";

    const orderItems = await OrderItem.findAll({
        where: { order_id: orderId },
        include: [
            { model: Book, as: "book" },
            { model: Order, as: "order" }
        ]
    });

    for (const item of orderItems) {
        const book = item.book;
        const order = item.order;

        if (book && order) {
            await SoldBook.create({
                book_id: book.id,
                titleBook: book.titleBook,
                price: book.price + 40,
                description: book.description,
                bookPic: book.bookPic,
                userId: book.userId,
                buyerId: order.user_id
            });

            await Book.update(
                { status: "sold", quantity: 0 },
                { where: { id: book.id } }
            );

            await Cart.destroy({
                where: {
                    bookId: book.id,
                    userId: order.user_id
                }
            });
        }
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
        throw new Error("ไม่พบข้อมูลการสั่งซื้อ");
    }

    await Notification.create({
        user_id: order.user_id,
        Title_message: finalTitle,
        message: finalMessage,
        status: "unread",
        order_id: orderId
    });
};

// ปฏิเสธคำสั่งซื้อ
const rejectOrder = async (transactionId, orderId, titleMessage = null, message = null) => {
    const finalTitle = titleMessage || "การสั่งซื้อของคุณไม่ได้รับการอนุมัติ";
    const finalMessage = message || "กรุณาติดต่อฝ่ายสนับสนุนสำหรับข้อมูลเพิ่มเติม";

    const order = await Order.findByPk(orderId);
    if (!order) {
        throw new Error("ไม่พบข้อมูลการสั่งซื้อ");
    }

    await Notification.create({
        user_id: order.user_id,
        Title_message: finalTitle,
        message: finalMessage,
        status: "unread",
        order_id: orderId
    });
};

// อัพเดทสถานะหนังสือ
export const updateBookStatus = async (bookId) => {
    const [affectedRows] = await Book.update(
        { checkStatusBooks: "available" },
        { where: { id: bookId } }
    );

    if (affectedRows === 0) {
        throw new Error("Book not found or already updated");
    }

    return { bookId };
};

