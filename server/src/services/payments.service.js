import { sequelize, Order, Address, Pickup, OrderItem, Payment, Notification } from "../models/index.js";

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

    const t = await sequelize.transaction();

    try {
        const order = await Order.create({
            user_id: userId,
            total_price: update_price || total_cost,
            type,
            orther: other
        }, { transaction: t });

        const orderId = order.id;

        if (!orderId) {
            throw new Error("Error adding order");
        }

        if (type === "delivery") {
            await Address.create({
                order_id: orderId,
                full_name: fullName,
                phone,
                house_no,
                street,
                zone,
                subdistrict,
                district,
                province,
                zip_code,
                email
            }, { transaction: t });
        } else if (type === "pickup") {
            await Pickup.create({
                order_id: orderId,
                full_name: fullName,
                pickup_datetime: date_and_time,
                location,
                email
            }, { transaction: t });
        }

        if (!Array.isArray(orderData) || orderData.length === 0) {
            throw new Error("Invalid order data");
        }

        const orderItems = orderData.map(item => ({
            order_id: orderId,
            book_id: item.bookId,
            quantity: item.quantity || 1,
            price: item.price
        }));
        
        await OrderItem.bulkCreate(orderItems, { transaction: t });

        const paymentDateTime_New = new Date();
        await Payment.create({
            order_id: orderId,
            payment_method: paymentMethod,
            payment_datetime_new: paymentDateTime_New
        }, { transaction: t });

        await t.commit();
        return { orderId };
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

// อัปเดตข้อมูลการชำระเงินและสลิป
export const updatePaymentSlip = async (orderId, paymentDate, paymentTime, filePath) => {
    const randomTransactioNumber = Math.floor(Math.random() * 9000000) + 1000000;
    const paymentDateTime = paymentDate + " " + paymentTime;

    const [affectedRows] = await Payment.update({
        transaction_id: randomTransactioNumber,
        payment_datetime: paymentDateTime,
        slip_image: filePath
    }, {
        where: { order_id: orderId }
    });

    if (affectedRows === 0) {
        throw new Error("Payment record not found for this order");
    }

    return { transactionId: randomTransactioNumber };
};

// ดึงราคาซื้อทั้งหมดของ Order
export const getTotalCost = async (orderId) => {
    if (!orderId) {
        throw new Error("Order ID is required");
    }
    
    const order = await Order.findByPk(orderId, {
        attributes: ["total_price"],
        raw: true
    });

    if (!order) {
        throw new Error("Order not found");
    }

    return order.total_price;
};

// แก้ไขข้อมูลการชำระเงินและลบการแจ้งเตือน
export const editPaymentDetails = async (notificationId, paymentDate, paymentTime, filePath) => {
    const notification = await Notification.findByPk(notificationId, {
        attributes: ["order_id"],
        raw: true
    });

    const orderId = notification?.order_id;
    if (!orderId) {
        throw new Error("Notification or Order not found");
    }

    const paymentDateTime = paymentDate + " " + paymentTime;

    const [affectedRows] = await Payment.update({ 
        payment_datetime: paymentDateTime,
        slip_image: filePath
    }, {
        where: { order_id: orderId }
    });

    await Notification.destroy({
        where: { order_id: orderId }
    });

    return affectedRows;
};

