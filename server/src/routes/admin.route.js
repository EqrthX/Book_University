import express from "express";
import { fetchInfomation, showBooksUnavailable, showStatusPayment, updateOrdersStatus, updateStatusBook } from "../controllers/admin.controller.js";

const router = express.Router();

// RESTful Resource-based routes
router.get("/books/unavailable", showBooksUnavailable);
router.get("/payments", showStatusPayment);
router.get("/information/:id", fetchInfomation);
router.put("/orders/:id/status", updateOrdersStatus);
router.put("/books/:id/status", updateStatusBook);

// Legacy action-based route aliases
router.get("/show-books-unavailable", showBooksUnavailable);
router.get("/show-status-payment", showStatusPayment);
router.get("/show-information/:id", fetchInfomation);
router.put("/update-order-status/:id", updateOrdersStatus);
router.put("/update-status-book/:id", updateStatusBook);

export default router;
