import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.config.js";

const SoldBook = sequelize.define("SoldBook", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false
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
    bookPic: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    buyerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "sold_books",
    timestamps: false
});

export default SoldBook;
