import pool from "../config/DB.config.js";

// สร้าง Order และบันทึกข้อมูลการจัดส่ง/การชำระเงินใน Transaction เดียวกัน
export const createOrderTransaction = async (paymentDetails) => {
    const {
        type, 
        fullName, 
        house_no, 
        street, 
        zone, 
        subdistrict, 
        district, 
        province, 
        zip_code, 
        phone,
        email, 
        other, 
        location,
        paymentMethod, 
        price, 
        userId, 
        date_and_time,
        total_price = 0,
        orderData,
        shipping_cost
    } = paymentDetails;

    if (isNaN(total_price)) {
        throw new Error("Invalid total_price: must be a number");
    }

    if (isNaN(shipping_cost)) {
        throw new Error("Invalid shipping_cost: must be a number");
    }

    let total_cost = total_price;
    let update_price = 0;
    if (type === "delivery") {
        total_cost += shipping_cost;
        update_price = price + shipping_cost;
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();       

    try {
        const [order] = await connection.query(
            "INSERT INTO orders(user_id, total_price, type, orther) VALUES(?, ?, ?, ?)",
            [userId, update_price || total_cost, type, other]
        );

        const orderId = order.insertId;

        if (!orderId) {
            throw new Error("Error adding order");
        }

        if (type === "delivery") {
            await connection.query(
                "INSERT INTO addresses (order_id, full_name, phone, house_no, street, zone, subdistrict, district, province, zip_code, email) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [orderId, fullName, phone, house_no, street, zone, subdistrict, district, province, zip_code, email]
            );
        } else if (type === "pickup") {
            await connection.query(
                "INSERT INTO pickups (order_id, full_name, pickup_datetime, location, email) VALUES(?, ?, ?, ?, ?)",
                [orderId, fullName, date_and_time, location, email]
            );
        }

        if (!Array.isArray(orderData) || orderData.length === 0) {
            throw new Error("Invalid order data");
        }

        const orderItems = orderData.map(item => [
            orderId,
            item.bookId,
            item.quantity || 1,
            item.price
        ]);
        
        await connection.query(
            "INSERT INTO order_items(order_id, book_id, quantity, price) VALUES ?",
            [orderItems]
        );

        const paymentDateTime_New = new Date();
        await connection.query(
            "INSERT INTO payments(order_id, payment_method, payment_datetime_new) VALUES(?, ?, ?)",
            [orderId, paymentMethod, paymentDateTime_New]
        );

        await connection.commit();
        return { orderId };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// อัปเดตข้อมูลการชำระเงินและสลิป
export const updatePaymentSlip = async (orderId, paymentDate, paymentTime, filePath) => {
    const randomTransactioNumber = Math.floor(Math.random() * 9000000) + 1000000;
    const paymentDateTime = paymentDate + " " + paymentTime;

    const [payment] = await pool.execute(
        `UPDATE payments SET transaction_id = ?, payment_datetime = ?, slip_image = ?  WHERE order_id = ?`,
        [randomTransactioNumber, paymentDateTime, filePath, orderId]
    );

    if (payment.affectedRows === 0) {
        throw new Error("Payment record not found for this order");
    }

    return { transactionId: randomTransactioNumber };
};

// ดึงราคาซื้อทั้งหมดของ Order
export const getTotalCost = async (orderId) => {
    if (!orderId) {
        throw new Error("Order ID is required");
    }
    
    const [totalCost] = await pool.execute(
        `SELECT total_price FROM orders WHERE id = ?`,
        [orderId]
    );

    if (totalCost.length === 0) {
        throw new Error("Order not found");
    }

    return totalCost[0].total_price;
};

// แก้ไขข้อมูลการชำระเงินและลบการแจ้งเตือน
export const editPaymentDetails = async (notificationId, paymentDate, paymentTime, filePath) => {
    const [getStatusPayment_orders] = await pool.execute(
        `SELECT order_id FROM notifications WHERE id = ?`,
        [notificationId]
    );

    const orderId = getStatusPayment_orders[0]?.order_id;
    if (!orderId) {
        throw new Error("Notification or Order not found");
    }

    const paymentDateTime = paymentDate + " " + paymentTime;

    const [result] = await pool.execute(
        `
        UPDATE payments
        SET 
            payment_datetime = ?,
            slip_image = ?
        WHERE order_id = ?
        `,
        [paymentDateTime, filePath, orderId]
    );

    await pool.execute(
        `DELETE FROM notifications WHERE order_id = ?`, 
        [orderId]
    );

    return result;
};
