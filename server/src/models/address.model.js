import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.config.js";

const Address = sequelize.define("Address", {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    full_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    house_no: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    street: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    zone: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    subdistrict: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    district: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    province: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    zip_code: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: "addresses",
    timestamps: false
});

export default Address;
