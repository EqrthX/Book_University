import express from "express"
import { homepage,  showDetailBook,  getSubjects,  showUserBooks, showBookWithId, searchKeyword, showHistory, showHistoryOrders, showHistoryBook_WithId } from "../controllers/homepage.controller.js";

const router = express.Router();

router.get("/homepage", homepage)

router.get("/get-subjects", getSubjects)

router.get('/search-books', searchKeyword)

router.get("/show-once-book/:id", showDetailBook)

router.get("/show-for-user", showUserBooks)

router.get("/show-for-edit-IdBook/:id", showBookWithId)

router.get("/show-history-order", showHistoryOrders)

router.get('/show-history', showHistory)

router.get("/show-history-book/:id", showHistoryBook_WithId)

export default router
