import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.config.js";

const Subject = sequelize.define("Subject", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subjectCode: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    }
}, {
    tableName: "subjects",
    timestamps: false
});

export default Subject;
