import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { addBook, deleteBook, updateBook } from "../controllers/product.controller.js";
import upload from "../middleware/upload.middleware.js";
import { showBooks } from "../controllers/homepage.controller.js";

const router = express.Router();

router.get("/show-books", verifyToken, showBooks)

router.post("/add-book", verifyToken, upload, addBook)

router.put("/update-book/:id", verifyToken, updateBook)

router.delete("/delete-book", verifyToken, deleteBook)

export default router