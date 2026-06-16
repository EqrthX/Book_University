import * as adminService from "../services/admin.service.js";

export const showBooksUnavailable = async(req, res) => {
    try {
        const books = await adminService.getUnavailableBooks();
        console.log("Database Query Result:", books);

        res.status(200).json({
            message: "Show All Books are unavailable",
            books: books
        });
    } catch (error) {
        console.error("Error controller showBooksUnavailable: ", error.message);
        res.status(500).json({
            error: error.message || "Error fetching books"
        });
    }
}

export const showStatusPayment = async(req, res) => {
    try {
        const statusPayment = await adminService.getPaymentStatus();

        return res.status(200).json({
            message: "Fetch statusPayment Successfully",
            statusPayment: statusPayment
        });
    } catch (error) {
        console.error("Error Show Status Payment Controller: ", error);
        return res.status(500).json({
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
        console.error("ข้อผิดพลาดใน fetchInfomation controller: ", error.message);
        return res.status(500).json({
            error: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูล"
        });
    }
};

export const updateOrdersStatus = async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { Title_message, message } = req.body;

        console.log("Received status:", status);

        const updatedStatus = await adminService.updateOrderStatus(id, status, Title_message, message);

        console.log("Updated order status in DB:", updatedStatus);

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
        console.error("ข้อผิดพลาดใน updateOrdersStatus controller: ", error.message);
        return res.status(500).json({
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
        console.log("Error in updateStatusBook Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error Updating Status book"
        });
    }
};

