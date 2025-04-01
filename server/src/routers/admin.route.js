import express from "express"
import { verifyToken } from "../middleware/auth.middleware.js"
import upload from "../middleware/upload.middleware.js"
import { fetchInfomation, showBooksUnavailable, showStatusPayment, updateOrdersStatus, updateStatusBook } from "../controllers/admin.controller.js"

const router = express.Router()

router.get("/show-books-unavailable", verifyToken, showBooksUnavailable)

router.get("/show-status-payment", verifyToken, showStatusPayment)

router.get("/show-information/:id", verifyToken, fetchInfomation)

router.put('/update-order-status/:id', verifyToken, updateOrdersStatus)

router.put("/update-status-book/:id", verifyToken, updateStatusBook)

export default router