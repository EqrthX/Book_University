import express from "express"
import { verifyToken } from "../middleware/auth.middleware.js";
import { homepage,  showDetailBook,  getSubjects,  showUserBooks, showBookWithId, searchKeyword, showHistory, showHistoryOrders, showHistoryBook_WithId } from "../controllers/homepage.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/homepage",verifyToken, homepage)

router.get("/get-subjects", verifyToken, getSubjects)

router.get('/search-books', verifyToken, searchKeyword)

router.get("/show-once-book/:id", verifyToken, showDetailBook)

router.get("/show-for-user", verifyToken, showUserBooks)

router.get("/show-for-edit-IdBook/:id", verifyToken, showBookWithId)

router.get("/show-history-order", verifyToken, showHistoryOrders)

router.get('/show-history', verifyToken, showHistory)

router.get("/show-history-book/:id", verifyToken, showHistoryBook_WithId)

export default router