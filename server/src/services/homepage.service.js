import { Subject, Book, Order, OrderItem, Address, Pickup, Payment, SoldBook, User } from "../models/index.js";
import { Op } from "sequelize";

// แสดงรายชื่อวิชาทั้งหมด
export const getAllSubjects = async (limit = 100, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 100);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    return await Subject.findAll({
        limit: lim,
        offset: off,
        raw: true
    });
};

// แสดงหนังสือที่ได้รับการยืนยันแล้วและไม่ใช่ของตัวเอง
export const getAvailableBooksExcludingUser = async (userId, limit = 50, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 50);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    return await Book.findAll({
        where: {
            status: "available",
            checkStatusBooks: "available",
            userId: { [Op.ne]: userId }
        },
        limit: lim,
        offset: off,
        raw: true
    });
};

// แสดงหนังสือที่ยังไม่ได้รับการยืนยันสำหรับ Admin
export const getUnavailableBooks = async (limit = 50, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 50);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    return await Book.findAll({
        where: {
            checkStatusBooks: "unavailable"
        },
        limit: lim,
        offset: off,
        raw: true
    });
};

// แสดงรายละเอียดหนังสือของแต่ละเล่มโดยมีการเชื่อมโยงกับตาราง subjects
export const getBookDetails = async (bookId) => {
    const book = await Book.findOne({
        where: { id: bookId },
        include: [{
            model: Subject,
            as: "subject",
            attributes: ["subjectCode"]
        }]
    });

    if (!book) return null;

    const plainBook = book.get({ plain: true });
    return {
        ...plainBook,
        subjectCode: plainBook.subject?.subjectCode || null
    };
};

// แสดงสินค้าสำหรับ User คนนั้นๆด้วย userId ที่ลงขาย
export const getUserBooks = async (userId, limit = 50, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 50);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    return await Book.findAll({
        where: { userId },
        limit: lim,
        offset: off,
        raw: true
    });
};

// แสดงหนังสือที่เลือกและของ user คนนั้นๆ โดยใช้ userId และ bookId
export const getBookById = async (bookId) => {
    const book = await Book.findByPk(bookId);
    return book ? book.get({ plain: true }) : null;
};

// แสดงประวัติคำสั่งซื้อ
export const getCompletedOrderHistory = async (userId, limit = 50, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 50);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    const orders = await Order.findAll({
        where: {
            status: "completed",
            user_id: userId
        },
        include: [{
            model: OrderItem,
            as: "items",
            include: [{
                model: Book,
                as: "book"
            }]
        }],
        limit: lim,
        offset: off
    });

    const history = [];
    for (const order of orders) {
        for (const item of order.items) {
            if (item.book) {
                history.push({
                    id: userId,
                    order_id: order.id,
                    user_id: order.user_id,
                    type: order.type,
                    status: order.status,
                    delivery_status: order.delivery_status,
                    bookId: item.book.id,
                    titleBook: item.book.titleBook,
                    description: item.book.description,
                    price: item.book.price,
                    bookPic: item.book.bookPic,
                    book_id: item.book_id
                });
            }
        }
    }

    return history;
};

// แสดงประวัติคำสั่งซื้อแบบละเอียด (address, pickup, payment, books)
export const getCompletedOrderDetails = async (userId, limit = 50, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 50);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    const orders = await Order.findAll({
        where: {
            status: "completed",
            user_id: userId
        },
        include: [
            { model: Address, as: "address" },
            { model: Pickup, as: "pickup" },
            { model: Payment, as: "payment" },
            {
                model: OrderItem,
                as: "items",
                include: [{ model: Book, as: "book" }]
            }
        ],
        limit: lim,
        offset: off
    });

    const results = [];
    for (const order of orders) {
        const addr = order.address ? order.address.get({ plain: true }) : {};
        const pick = order.pickup ? order.pickup.get({ plain: true }) : {};
        const pay = order.payment ? order.payment.get({ plain: true }) : {};

        for (const item of order.items) {
            if (item.book) {
                results.push({
                    id: userId,
                    order_id: order.id,
                    user_id: order.user_id,
                    type: order.type,
                    status: order.status,

                    Address_order_id: addr.order_id || null,
                    Address_full_name: addr.full_name || null,
                    house_no: addr.house_no || null,
                    street: addr.street || null,
                    zone: addr.zone || null,
                    subdistrict: addr.subdistrict || null,
                    district: addr.district || null,
                    province: addr.province || null,
                    zip_code: addr.zip_code || null,
                    Address_email: addr.email || null,

                    pickup_order_id: pick.order_id || null,
                    fullName: pick.full_name || null,
                    pickup_datetime: pick.pickup_datetime || null,
                    location: pick.location || null,
                    email: pick.email || null,

                    p_order_id: pay.order_id || null,
                    payment_method: pay.payment_method || null,
                    payment_datetime: pay.payment_datetime || null,

                    book_id: item.book_id,
                    bookId: item.book.id,
                    bookPic: item.book.bookPic,
                    titleBook: item.book.titleBook
                });
            }
        }
    }

    return results;
};

// ค้นหาหนังสือจาก Keyword
export const searchBooksByKeyword = async (bookKeyword, limit = 50, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 50);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    return await Book.findAll({
        where: {
            status: "available",
            titleBook: { [Op.like]: `%${bookKeyword}%` }
        },
        limit: lim,
        offset: off,
        raw: true
    });
};

// แสดงประวัติการซื้อของหนังสือเฉพาะเล่ม
export const getBookPurchaseHistory = async (bookId, limit = 50, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 50);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    const soldBooks = await SoldBook.findAll({
        where: { book_id: bookId },
        limit: lim,
        offset: off,
        raw: true
    });

    const results = [];
    for (const sb of soldBooks) {
        const order = await Order.findOne({
            where: { user_id: sb.buyerId },
            raw: true
        });

        results.push({
            book_id: sb.book_id,
            titleBook: sb.titleBook,
            price: sb.price,
            bookPic: sb.bookPic,
            buyerId: sb.buyerId,
            user_id: order ? order.user_id : null,
            delivery_status: order ? order.delivery_status : null
        });
    }

    return [results]; // Returning [results] to match original structure where history[0] was expected
};

