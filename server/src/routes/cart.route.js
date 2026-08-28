import express from "express";
import { addToCart, deleteItemCart, showBookWithCart } from "../controllers/cart.controller.js";

const router = express.Router();

// RESTful Resource-based routes
router.get("/", showBookWithCart);
router.post("/:id", addToCart);
router.delete("/:id", deleteItemCart);
router.delete("/", deleteItemCart);

// Legacy action-based route aliases
router.get("/show-cart", showBookWithCart);
router.post("/add-to-cart/:id", addToCart);
router.delete("/delete-item-cart/:id", deleteItemCart);
router.delete("/delete-item-cart", deleteItemCart);

export default router;
