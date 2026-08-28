import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.config.js";

const OrderItem = sequelize.define("OrderItem", {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    book_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: "order_items",
    timestamps: false
});

export default OrderItem;
