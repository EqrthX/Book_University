import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.config.js";

const Payment = sequelize.define("Payment", {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    payment_method: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    payment_datetime: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    payment_datetime_new: {
        type: DataTypes.DATE,
        allowNull: true
    },
    transaction_id: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    slip_image: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: "payments",
    timestamps: false
});

export default Payment;
