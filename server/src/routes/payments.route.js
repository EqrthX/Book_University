import express from "express"
import upload from "../middleware/upload.middleware.js";
import { addInfomationAndOrder, editPayment, showTotalCost, updatePayment } from "../controllers/payments.controller.js";

const router = express.Router()

router.post("/show-total-cost", showTotalCost)

router.post("/add-infomation-order", addInfomationAndOrder)

router.put('/update-payment', upload, updatePayment)

router.put("/edit-payment/:id", upload, editPayment)

export default router
