import fs from 'fs'
import path from 'path'
import pool from './DB.config.js'

const sqlFilePath = path.join(process.cwd(), "databases.sql");

async function initializeDatabase() {
    try {
        
        const sql = fs.readFileSync(sqlFilePath, "utf-8");

        const sqlStatements = sql.split(/;\s*$/m).filter(statement => statement.trim() !== "");

        for (const statement of sqlStatements) {
            await pool.query(statement);
        }

        console.log("✅ Database & Tables created successfully!");
    } catch (error) {
        console.error("❌ Error creating database:", error);
    } finally {
        process.exit();
    }
}

initializeDatabase()