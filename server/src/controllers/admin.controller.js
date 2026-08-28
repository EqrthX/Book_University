import * as adminService from "../services/admin.service.js";

export const showBooksUnavailable = async(req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : (page - 1) * limit;

        const books = await adminService.getUnavailableBooks(limit, offset);

        res.status(200).json({
            message: "Show All Books are unavailable",
            books: books || []
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            error: error.message || "Error fetching books"
        });
    }
}

export const showStatusPayment = async(req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : (page - 1) * limit;

        const statusPayment = await adminService.getPaymentStatus(limit, offset);

        return res.status(200).json({
            message: "Fetch statusPayment Successfully",
            statusPayment: statusPayment || []
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            message: error.message
        });
    }
}

export const fetchInfomation = async(req, res) => {
    try {
        const { id } = req.params;

        const result = await adminService.getOrderInformation(id);

        return res.status(200).json({
            message: "ดึงข้อมูลคำสั่งซื้อสำเร็จ",
            infomation: result.information,
            showBooks: result.books,
        });
    } catch (error) {
        const statusCode = error.statusCode || (error.message?.includes("ไม่พบ") ? 404 : 500);
        return res.status(statusCode).json({
            error: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูล"
        });
    }
};

export const updateOrdersStatus = async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { Title_message, message } = req.body;

        const updatedStatus = await adminService.updateOrderStatus(id, status, Title_message, message);

        if (status === "completed") {
            return res.status(200).json({
                message: "การสั่งซื้อของคุณได้รับการอนุมัติแล้ว",
                updatedStatus: updatedStatus || "unknown",
            });
        } else if (status === "Not_Approved") {
            return res.status(200).json({
                message: "การสั่งซื้อของคุณไม่ได้รับการอนุมัติ",
                updatedStatus: updatedStatus || "unknown",
            });
        }

        return res.status(200).json({
            message: "อัพเดทสถานะการสั่งซื้อเรียบร้อยแล้ว",
            updatedStatus: updatedStatus || "unknown",
        });
    } catch (error) {
        const statusCode = error.statusCode || (error.message?.includes("ไม่พบ") ? 404 : 500);
        return res.status(statusCode).json({
            message: error.message
        });
    }
};

export const updateStatusBook = async(req, res) => {
    try {
        const bookId = req.params.id;
        const result = await adminService.updateBookStatus(bookId);

        res.status(200).json({
            message: "Update Status Book Successfully!",
            book: result
        });
    } catch (error) {
        const statusCode = error.statusCode || (error.message?.includes("not found") ? 404 : 500);
        res.status(statusCode).json({
            error: error.message || "Error Updating Status book"
        });
    }
};

export const showUsersList = async(req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 100;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : (page - 1) * limit;

        const users = await adminService.getAllUsers(limit, offset);

        res.status(200).json({
            message: "Fetch Users List Successfully",
            users: users || []
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            error: error.message || "Error fetching users list"
        });
    }
};

export const updateUserRole = async(req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;

        if (!role || !["student", "admin"].includes(role)) {
            return res.status(400).json({ error: "Invalid role value" });
        }

        const result = await adminService.updateUserRole(userId, role);

        res.status(200).json({
            message: "Update User Role Successfully!",
            user: result
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            error: error.message || "Error updating user role"
        });
    }
};

export const deleteUser = async(req, res) => {
    try {
        const userId = req.params.id;

        // ป้องกัน Admin ลบตัวเอง
        if (parseInt(userId, 10) === req.user?.id) {
            return res.status(400).json({ error: "You cannot delete your own admin account!" });
        }

        await adminService.deleteUser(userId);

        res.status(200).json({
            message: "Delete User Account Successfully!"
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            error: error.message || "Error deleting user account"
        });
    }
};

export const showAllBooks = async(req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 100;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : (page - 1) * limit;

        const books = await adminService.getAllBooksAdmin(limit, offset);

        res.status(200).json({
            message: "Fetch All Books Successfully",
            books: books || []
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            error: error.message || "Error fetching books list"
        });
    }
};

export const adminUpdateBook = async(req, res) => {
    try {
        const bookId = req.params.id;
        const { checkStatusBooks, status } = req.body;

        const result = await adminService.updateBookStatusAdmin(bookId, { checkStatusBooks, status });

        res.status(200).json({
            message: "Update Book Status Successfully!",
            book: result
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            error: error.message || "Error updating book status"
        });
    }
};

export const adminDeleteBook = async(req, res) => {
    try {
        const bookId = req.params.id;
        await adminService.deleteBookAdmin(bookId);

        res.status(200).json({
            message: "Delete Book Successfully by Admin"
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            error: error.message || "Error deleting book"
        });
    }
};

