import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.config.js";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    studentId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    fullName: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    user_role: {
        type: DataTypes.ENUM("student", "admin"),
        allowNull: false,
        defaultValue: "student"
    }
}, {
    tableName: "users",
    timestamps: true, // Sequelize will map createdAt and updatedAt
});

export default User;
