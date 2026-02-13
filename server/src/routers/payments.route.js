import express from "express"
import { verifyToken } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { addInfomationAndOrder, editPayment, showTotalCost, updatePayment } from "../controllers/payments.controller.js";

const router = express.Router()

router.post("/show-total-cost", verifyToken, showTotalCost)

router.post("/add-infomation-order", verifyToken, addInfomationAndOrder)

router.put('/update-payment', verifyToken, upload, updatePayment)

router.put("/edit-payment/:id", verifyToken, upload, editPayment)

export default router