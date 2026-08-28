import express from "express";
import { addBook, deleteBook, updateBook, showBooks } from "../controllers/product.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// Legacy action-based route aliases
router.get("/show-books", showBooks);
router.post("/add-book", upload, addBook);
router.put("/update-book/:id", updateBook);
router.delete("/delete-book", deleteBook);
router.delete("/delete-book/:id", deleteBook);

// RESTful Resource-based routes
router.get("/", showBooks);
router.post("/", upload, addBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;
