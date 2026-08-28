import pool from "../config/DB.config.js";

// เพิ่มหนังสือในตะกร้า
export const addBookToCart = async (userId, bookId) => {
    // ตรวจสอบว่าหนังสือมีในตะกร้าแล้ว
    const [existingCart] = await pool.execute(
        "SELECT * FROM cart WHERE userId = ? AND bookId = ?",
        [userId, bookId]
    );

    if (existingCart.length > 0) {
        const error = new Error("มีหนังสือเล่มนี้อยู่ในตะกร้าอยู่แล้ว");
        error.statusCode = 409;
        throw error;
    }

    await pool.execute(
        "INSERT INTO cart (userId, bookId) VALUES (?, ?)",
        [userId, bookId]
    );

    return { message: "เพิ่มหนังสือในตะกร้าเรียบร้อยแล้ว" };
};

// ดึงหนังสือในตะกร้า
export const getCartBooks = async (userId, limit = 50, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 50);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    const [books] = await pool.query(
        "SELECT c.id AS cartId, b.* FROM books AS b INNER JOIN cart AS c ON b.id = c.bookId WHERE c.userId = ? LIMIT ? OFFSET ?",
        [userId, lim, off]
    );

    return books;
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

    const placeholders = filteredIds.map(() => '?').join(',');
    const queryParams = userId ? [...filteredIds, userId] : filteredIds;
    const userClause = userId ? " AND userId = ?" : "";

    const [result] = await pool.execute(
        `DELETE FROM cart WHERE id IN (${placeholders})${userClause}`,
        queryParams
    );

    if (result.affectedRows === 0) {
        const error = new Error("ไม่พบรายการในตะกร้า");
        error.statusCode = 404;
        throw error;
    }

    return { message: "ลบหนังสือในตะกร้าเรียบร้อยแล้ว" };
};

// ดึงข้อมูลตะกร้าพร้อมราคา
export const getCartTotal = async (userId) => {
    const [result] = await pool.execute(
        `SELECT SUM(b.price) as total, COUNT(*) as count 
         FROM cart c 
         JOIN books b ON c.bookId = b.id 
         WHERE c.userId = ?`,
        [userId]
    );

    return result[0];
};

// ล้างตะกร้า
export const clearCart = async (userId) => {
    const [result] = await pool.execute(
        "DELETE FROM cart WHERE userId = ?",
        [userId]
    );

    return result.affectedRows;
};
