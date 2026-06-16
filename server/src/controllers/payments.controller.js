import * as paymentsService from "../services/payments.service.js";

export const addInfomationAndOrder = async(req, res) => {
    try {
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
        } = req.body;

        const result = await paymentsService.createOrderTransaction({
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
            total_price,
            orderData,
            shipping_cost
        });

        res.status(200).json({
            message: "Add Order compete!",
            orderId: result.orderId
        });

    } catch (error) {
        res.status(500).json({
            message: error.message || error
        });
    }
}

export const updatePayment = async(req, res) => {
    try {
        const {orderId, payment_date, payment_time} = req.body;
        const slip_image = req.files?.paymentSlip?.[0];
        const filePath = slip_image ? slip_image.path : null;

        await paymentsService.updatePaymentSlip(orderId, payment_date, payment_time, filePath);

        return res.status(200).json({
            message: "Update Payments Successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error
        });
    }
}

export const showTotalCost = async(req, res) => {
    try {
        const {orderId} = req.body;
        
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }
        
        const totalCost = await paymentsService.getTotalCost(orderId);

        return res.status(200).json({
            message: "Show Total Cost Successfully",
            totalCost: totalCost
        });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error
        });
    }
}

export const editPayment = async(req, res) => {
    try {
        const {id} = req.params;
        const {payment_date, payment_time} = req.body;
        const slip_image = req.files?.paymentSlip?.[0];
        const filePath = slip_image ? slip_image.path : null;

        const result = await paymentsService.editPaymentDetails(id, payment_date, payment_time, filePath);

        return res.status(200).json({
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}
