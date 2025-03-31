import pool from "../config/DB.config.js";
import multer from "multer";

export const addInfomationAndOrder = async(req, res) => {

    try {

        const paymentDateTime_New = new Date()
        
        
        let {

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

        } = req.body

        if (isNaN(total_price)) {
            throw new Error("Invalid total_price: must be a number");
        }

        if (isNaN(shipping_cost)) {
            throw new Error("Invalid shipping_cost: must be a number");
        }

        let total_cost = total_price
        let update_price = 0
        if(type === "delivery") {
            total_cost += shipping_cost
            update_price = price + shipping_cost
        }

        const connection = await pool.getConnection()
        connection.beginTransaction()       

        const [order] = await connection.query(
            "INSERT INTO orders(user_id, total_price, type, orther) VALUES(?, ?, ?, ?)",
            [userId, update_price || total_cost, type, other]
        )

        const orderId = order.insertId;

        if(!orderId) {
            await connection.rollback();
            return res.status(400).json({ message: "Error adding order"})
        }

        if(type === "delivery") {

            await connection.query(
                "INSERT INTO addresses (order_id, full_name, phone, house_no, street, zone, subdistrict, district, province, zip_code, email) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [orderId, fullName, phone, house_no, street, zone, subdistrict, district, province, zip_code, email]
            )
            
            
        } else if(type === "pickup") {
            const [result_pickup] = await connection.query(
                "INSERT INTO pickups (order_id, full_name, pickup_datetime, location, email) VALUES(?, ?, ?, ?, ?)",
                [orderId, fullName, date_and_time, location, email]
            )
            
        }

        if(!Array.isArray(orderData) || orderData.length  === 0) {
            await connection.rollback()
            return res.status(400).json({
                message: "Invalid order data"
            })
        }

        const orderItems = orderData.map(item => [
            orderId,
            item.bookId,
            item.quantity || 1,
            item.price
        ])
        
        await connection.query(
            "INSERT INTO order_items(order_id, book_id, quantity, price) VALUES ?",
            [orderItems]
        )

        await connection.query(
            "INSERT INTO payments(order_id, payment_method, payment_datetime_new) VALUES(?, ?, ?)",
            [orderId, paymentMethod, paymentDateTime_New]
        )

        await connection.commit()
        
        res.status(200).json({
            message: "Add Order compete!",
            orderId: orderId
        })

    } catch (error) {
        console.error("Error controller Add Information and Order ", error)
        res.status(500).json({
            message:error.message || error
        })
    }
}

export const updatePayment = async(req, res) => {
    try {
        const {orderId, payment_date, payment_time} = req.body
        const slip_image = req.files?.paymentSlip?.[0]; // ✅ ดึงไฟล์จาก `req.files`
        
        const randomTransactioNumber = Math.floor(Math.random() * 9000000) + 1000000
        const paymentDateTime = payment_date + " " + payment_time

        const filePath = slip_image ? slip_image.path : null;

        const [payment] = await pool.execute(
            `UPDATE payments SET transaction_id = ?, payment_datetime = ?, slip_image = ?  WHERE order_id = ?`,
            [randomTransactioNumber, paymentDateTime, filePath, orderId]
        )

        if(payment) {
            return res.status(200).json({
                message: "Update Payments Successfully"
            })
        }

    } catch (error) {
        console.error("Error UpdatePayment Controller: ", error)
        return res.status(500).json({
            message: error.message || error
        })
    }
}

export const showTotalCost = async(req, res) => {
    try {
        const {orderId} = req.body
        
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }
        
        const [totalCost] = await pool.execute(
            `SELECT total_price FROM orders WHERE id = ?`,
            [orderId]
        )

        return res.status(200).json({
            message: "Show Total Cost Successfully",
            totalCost: totalCost[0].total_price
        })
        
    } catch (error) {
        console.error("Error Show Total Cost Controller: ", error)
        return res.status(500).json({
            message: error.message || error
        })
    }
}