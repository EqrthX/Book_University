import express from "express";
import { fetchInfomation, showBooksUnavailable, showStatusPayment, updateOrdersStatus, updateStatusBook, showUsersList, updateUserRole, deleteUser, showAllBooks, adminUpdateBook, adminDeleteBook } from "../controllers/admin.controller.js";

const router = express.Router();

// RESTful Resource-based routes
router.get("/books/unavailable", showBooksUnavailable);
router.get("/payments", showStatusPayment);
router.get("/information/:id", fetchInfomation);
router.put("/orders/:id/status", updateOrdersStatus);
router.put("/books/:id/status", updateStatusBook);

router.get("/books", showAllBooks);
router.put("/books/:id/admin-status", adminUpdateBook);
router.delete("/books/:id", adminDeleteBook);

router.get("/users", showUsersList);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// Legacy action-based route aliases
router.get("/show-books-unavailable", showBooksUnavailable);
router.get("/show-status-payment", showStatusPayment);
router.get("/show-information/:id", fetchInfomation);
router.put("/update-order-status/:id", updateOrdersStatus);
router.put("/update-status-book/:id", updateStatusBook);

export default router;
