import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.config.js";

const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "pending"
    },
    delivery_status: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    orther: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: "orders",
    timestamps: false
});

export default Order;
