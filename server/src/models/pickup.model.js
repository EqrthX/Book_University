import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.config.js";

const Pickup = sequelize.define("Pickup", {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    full_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    pickup_datetime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: "pickups",
    timestamps: false
});

export default Pickup;
