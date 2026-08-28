import { Cart, Book } from "../models/index.js";
import { Op } from "sequelize";

// เพิ่มหนังสือในตะกร้า
export const addBookToCart = async (userId, bookId) => {
    // ตรวจสอบว่าหนังสือมีในตะกร้าแล้ว
    const existingCart = await Cart.findOne({
        where: { userId, bookId }
    });

    if (existingCart) {
        const error = new Error("มีหนังสือเล่มนี้อยู่ในตะกร้าอยู่แล้ว");
        error.statusCode = 409;
        throw error;
    }

    await Cart.create({ userId, bookId });

    return { message: "เพิ่มหนังสือในตะกร้าเรียบร้อยแล้ว" };
};

// ดึงหนังสือในตะกร้า
export const getCartBooks = async (userId, limit = 50, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 50);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    const cartItems = await Cart.findAll({
        where: { userId },
        include: [{
            model: Book,
            as: "book"
        }],
        limit: lim,
        offset: off
    });

    // Map to flat object structure: c.id AS cartId, b.*
    return cartItems.map(item => {
        const bookData = item.book ? item.book.get({ plain: true }) : {};
        return {
            cartId: item.id,
            ...bookData
        };
    });
};

// ลบหนังสือออกจากตะกร้า (พร้อม ownership check)
export const removeFromCart = async (cartIdsInput, userId) => {
    const ids = Array.isArray(cartIdsInput) ? cartIdsInput : [cartIdsInput];
    const filteredIds = ids.filter(Boolean);

    if (!filteredIds || filteredIds.length === 0) {
        const error = new Error("กรุณาเลือกสินค้าหนึ่งอย่างขึ้นไป");
        error.statusCode = 400;
        throw error;
    }

    const whereClause = {
        id: {
            [Op.in]: filteredIds
        }
    };
    if (userId) {
        whereClause.userId = userId;
    }

    const affectedRows = await Cart.destroy({
        where: whereClause
    });

    if (affectedRows === 0) {
        const error = new Error("ไม่พบรายการในตะกร้า");
        error.statusCode = 404;
        throw error;
    }

    return { message: "ลบหนังสือในตะกร้าเรียบร้อยแล้ว" };
};

// ดึงข้อมูลตะกร้าพร้อมราคา
export const getCartTotal = async (userId) => {
    const cartItems = await Cart.findAll({
        where: { userId },
        include: [{
            model: Book,
            as: "book",
            attributes: ["price"]
        }]
    });

    let total = 0;
    const count = cartItems.length;

    for (const item of cartItems) {
        if (item.book) {
            total += item.book.price;
        }
    }

    return { total, count };
};

// ล้างตะกร้า
export const clearCart = async (userId) => {
    return await Cart.destroy({
        where: { userId }
    });
};

