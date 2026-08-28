import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.config.js";

const Book = sequelize.define("Book", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titleBook: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    canMeet: {
        type: DataTypes.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: "no"
    },
    contactInfo: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    bookPic: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    checkStatusBooks: {
        type: DataTypes.ENUM("unavailable", "available"),
        allowNull: true,
        defaultValue: "unavailable"
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "available"
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "books",
    timestamps: true
});

export default Book;
