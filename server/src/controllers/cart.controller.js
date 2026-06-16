import * as cartService from "../services/cart.service.js";

export const addToCart = async(req, res) => {
    try {
        const userId = req.user?.id;
        const bookId = req.params.id;

        const result = await cartService.addBookToCart(userId, bookId);
        
        return res.status(201).json(result);
    } catch (error) {
        const statusCode = error.message === "มีหนังสือเล่มนี้อยู่ในตะกร้าอยู่แล้ว" ? 400 : 500;
        res.status(statusCode).json({
            error: error.message || "Error Adding to Cart"
        });
    }
}

export const showBookWithCart = async(req, res) => {
    try {
        const userId = req.user?.id;
        const books = await cartService.getCartBooks(userId);

        if(books.length === 0) {
            return res.status(200).json({ 
                message: "Books not found",
                books: []
            });
        }

        res.status(200).json({
            message: "Show Book with Cart",
            books: books
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Error fetching books"
        });
    }
}

export const deleteItemCart = async(req, res) => {
    const {cartIds} = req.body;

    if(!cartIds || cartIds.length === 0) {
        return res.status(400).json({ message: "กรุณาเลือกสินค้าหนึ่งอย่างขึ้นไป" });
    }

    try {
        const result = await cartService.removeFromCart(cartIds);
        res.status(200).json(result);
    } catch (error) {
        const statusCode = error.message === "ไม่พบรายการในตะกร้า" ? 400 : 500;
        res.status(statusCode).json({
            error: error.message || "Error Delete Item Cart"
        });
    }
}
