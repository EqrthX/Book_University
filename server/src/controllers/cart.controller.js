import * as cartService from "../services/cart.service.js";

export const addToCart = async(req, res) => {
    try {
        const userId = req.user?.id;
        const bookId = req.params.id;

        const result = await cartService.addBookToCart(userId, bookId);
        
        return res.status(201).json(result);
    } catch (error) {
        const statusCode = error.statusCode || (error.message === "มีหนังสือเล่มนี้อยู่ในตะกร้าอยู่แล้ว" ? 409 : 500);
        res.status(statusCode).json({
            error: error.message || "Error Adding to Cart"
        });
    }
}

export const showBookWithCart = async(req, res) => {
    try {
        const userId = req.user?.id;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : (page - 1) * limit;

        const books = await cartService.getCartBooks(userId, limit, offset);

        res.status(200).json({
            message: "Show Book with Cart",
            books: books || []
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            error: error.message || "Error fetching books"
        });
    }
}

export const deleteItemCart = async(req, res) => {
    const userId = req.user?.id;
    const cartIdFromParam = req.params.id;
    const { cartIds } = req.body || {};

    const targetCartIds = cartIdFromParam ? [cartIdFromParam] : cartIds;

    if (!targetCartIds || targetCartIds.length === 0) {
        return res.status(400).json({ message: "กรุณาเลือกสินค้าหนึ่งอย่างขึ้นไป" });
    }

    try {
        const result = await cartService.removeFromCart(targetCartIds, userId);
        res.status(200).json(result);
    } catch (error) {
        const statusCode = error.statusCode || (error.message === "ไม่พบรายการในตะกร้า" ? 404 : 500);
        res.status(statusCode).json({
            error: error.message || "Error Delete Item Cart"
        });
    }
}
