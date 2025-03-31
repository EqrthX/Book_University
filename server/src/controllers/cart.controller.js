import pool from "../config/DB.config.js";
import multer from "multer";

export const addToCart = async(req, res) => {

    try {

        const userId = req.user?.id;
        const bookId = req.params.id;

        const [existingCook] = await pool.execute(
            "SELECT * FROM cart WHERE userId = ? AND bookId = ?", [userId, bookId]
        )
        
        if(existingCook.length > 0) {
            return res.status(400).json({ message: "มีหนังสือเล่มนี้อยู่ในตะกร้าอยู่แล้ว" }); 
        }

        await pool.execute(
            "INSERT INTO cart (userId, bookId) VALUES (?, ?)",
            [userId, bookId]
        )
        

        return res.status(201).json({
            message: "เพิ่มหนังสือในตะกร้าเรียบร้อยแล้ว",
            
        })

    } catch (error) {
        console.error("Error in addToCart Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error Adding to Cart"
        })
    }

}

export const showBookWithCart = async(req, res) => {

    try {
        
        const userId = req.user?.id;

        const [books] = await pool.execute(
            "SELECT c.id AS cartId, b.* FROM books AS b INNER JOIN cart AS c ON b.id = c.bookId WHERE c.userId = ?",
            [userId]
        )

        if(books.length === 0) {
            return res.status(200).json({ message: "Books not found",
                books: []
            });
        }

        res.status(200).json({
            message: "Show Book with Cart",
            books: books
        })

    } catch (error) {
        console.error("Error in showBookWithCart Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error fetching books"
        })
    }

}

export const deleteItemCart = async(req, res) => {
    const {cartIds} = req.body

    if(!cartIds || cartIds.length === 0) {
        return res.status(400).json({ message: "กรุณาเลือกสินค้าหนึ่งอย่างขึ้นไป" });
    }

    try {
        const placeholders = cartIds.map(() => '?').join(',');
        const [cart] = await pool.execute(
            ` DELETE FROM cart WHERE id IN (${placeholders})`,
            cartIds
        )

        if(cart.affectedRows === 0) {
            return res.status(400).json({ message: "ไม่พบรายการในตะกร้า" });
        }

        res.status(200).json({
            message: "ลบหนังสือในตะกร้าเรียบร้อยแล้ว",
        })


    } catch (error) {
        console.error("Error in deleteItemCart Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error Delete Item Cart"
        })
        
    }
}