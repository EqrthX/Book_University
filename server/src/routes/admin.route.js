import express from "express"
import { fetchInfomation, showBooksUnavailable, showStatusPayment, updateOrdersStatus, updateStatusBook } from "../controllers/admin.controller.js"

const router = express.Router()

router.get("/show-books-unavailable", showBooksUnavailable)

router.get("/show-status-payment", showStatusPayment)

router.get("/show-information/:id", fetchInfomation)

router.put('/update-order-status/:id', updateOrdersStatus)

router.put("/update-status-book/:id", updateStatusBook)

export default router
