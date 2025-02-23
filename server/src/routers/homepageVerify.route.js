import express from "express"
import { verifyToken } from "../middleware/auth.middleware.js";
import { addBook, deleteBook, homepage, showBooks, showDetailBook, updateBook } from "../controllers/homepage.controller.js";

const router = express.Router();

router.get("/homepage",verifyToken, homepage)
router.post("/add-book", verifyToken, addBook)
router.get("/show-book", verifyToken, showBooks)
router.get("/show-once-book/:id", verifyToken, showDetailBook)
router.put("/update-book/:id", verifyToken, updateBook)
router.delete("/delete-book/:id", verifyToken, deleteBook)

export default router