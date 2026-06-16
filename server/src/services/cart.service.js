import pool from "../config/DB.config.js";

// เพิ่มหนังสือในตะกร้า
export const addBookToCart = async (userId, bookId) => {
    // ตรวจสอบว่าหนังสือมีในตะกร้าแล้ว
    const [existingCart] = await pool.execute(
        "SELECT * FROM cart WHERE userId = ? AND bookId = ?",
        [userId, bookId]
    );

    if (existingCart.length > 0) {
        throw new Error("มีหนังสือเล่มนี้อยู่ในตะกร้าอยู่แล้ว");
    }

    await pool.execute(
        "INSERT INTO cart (userId, bookId) VALUES (?, ?)",
        [userId, bookId]
    );

    return { message: "เพิ่มหนังสือในตะกร้าเรียบร้อยแล้ว" };
};

// ดึงหนังสือในตะกร้า
export const getCartBooks = async (userId) => {
    const [books] = await pool.execute(
        "SELECT c.id AS cartId, b.* FROM books AS b INNER JOIN cart AS c ON b.id = c.bookId WHERE c.userId = ?",
        [userId]
    );

    if (books.length === 0) {
        return [];
    }

    return books;
};

// ลบหนังสือออกจากตะกร้า
export const removeFromCart = async (cartIds) => {
    if (!cartIds || cartIds.length === 0) {
        throw new Error("กรุณาเลือกสินค้าหนึ่งอย่างขึ้นไป");
    }

    const placeholders = cartIds.map(() => '?').join(',');
    const [result] = await pool.execute(
        `DELETE FROM cart WHERE id IN (${placeholders})`,
        cartIds
    );

    if (result.affectedRows === 0) {
        throw new Error("ไม่พบรายการในตะกร้า");
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
