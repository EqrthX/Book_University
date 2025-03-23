import express from "express"
import { verifyToken } from "../middleware/auth.middleware.js";
import { addBook, deleteBook, homepage, showBooks, showDetailBook, updateBook, getSubjects, updateStatusBook, showBooksUnavailable, showUserBooks, showBookWithId, addToCart, showBookWithCart, deleteItemCart, addInfomationAndOrder, updatePayment, showStatusPayment, fetchInfomation, updateOrdersStatus, searchKeyword, showHistory, showHistoryOrders } from "../controllers/homepage.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/homepage",verifyToken, homepage)

router.post("/add-book", verifyToken, upload, addBook)

router.post("/add-to-cart/:id", verifyToken, addToCart)

router.post("/add-infomation-order", verifyToken, addInfomationAndOrder)

router.get("/get-subjects", verifyToken, getSubjects)

router.get("/show-books", verifyToken, showBooks)

router.get("/show-books-unavailable", verifyToken, showBooksUnavailable)

router.get("/show-once-book/:id", verifyToken, showDetailBook)

router.get("/show-for-user", verifyToken, showUserBooks)

router.get("/show-for-edit-IdBook/:id", verifyToken, showBookWithId)

router.get("/show-cart", verifyToken, showBookWithCart)

router.get("/show-status-payment", verifyToken, showStatusPayment)

router.get("/show-information/:id", verifyToken, fetchInfomation)

router.get("/show-history-order", verifyToken, showHistoryOrders)

router.put("/update-status-book/:id", verifyToken, updateStatusBook)

router.put("/update-book/:id", verifyToken, updateBook)

router.put('/update-payment', verifyToken, upload, updatePayment)

router.put('/update-order-status/:id', verifyToken, updateOrdersStatus)

router.get('/search-books', verifyToken, searchKeyword)

router.get('/fetch-history', verifyToken, showHistory)

router.delete("/delete-book", verifyToken, deleteBook)

router.delete("/delete-item-cart/:id", verifyToken, deleteItemCart)


export default router