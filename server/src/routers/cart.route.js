import exrpress from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { addToCart, deleteItemCart, showBookWithCart } from "../controllers/cart.controller.js";

const router = exrpress.Router();

router.get("/show-cart", verifyToken, showBookWithCart)

router.post("/add-to-cart/:id", verifyToken, addToCart)

router.delete("/delete-item-cart", verifyToken, deleteItemCart)


export default router