import express from "express";
import { addBook, deleteBook, updateBook } from "../controllers/product.controller.js";
import upload from "../middleware/upload.middleware.js";
import { showBooks } from "../controllers/homepage.controller.js";

const router = express.Router();

router.get("/show-books", showBooks)

router.post("/add-book", upload, addBook)

router.put("/update-book/:id", updateBook)

router.delete("/delete-book", deleteBook)

export default router
