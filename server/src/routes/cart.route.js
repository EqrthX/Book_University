import express from "express";
import { addToCart, deleteItemCart, showBookWithCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/show-cart", showBookWithCart)

router.post("/add-to-cart/:id", addToCart)

router.delete("/delete-item-cart", deleteItemCart)


export default router
