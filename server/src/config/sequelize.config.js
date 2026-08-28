import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const dbHost = process.env.DB_HOST?.trim();
const dbPort = parseInt(process.env.DB_PORT, 10) || 3306;
const dbUser = process.env.DB_USER?.trim();
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME?.trim();

const getSslCa = () => {
    if (process.env.DB_SSL_CA) {
        return Buffer.from(process.env.DB_SSL_CA, "base64").toString("utf-8");
    }
    if (fs.existsSync("./ca.pem")) {
        return fs.readFileSync("./ca.pem");
    }
    return undefined;
};

const sslCa = getSslCa();

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: "mysql",
    logging: false, // Set to console.log if SQL logs are needed
    dialectOptions: {
        ssl: sslCa ? { ca: sslCa } : undefined
    },
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export default sequelize;
