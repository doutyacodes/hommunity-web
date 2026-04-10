const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

(async () => {
    try {
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        console.log("Connected to MySQL");
        
        await connection.query('ALTER TABLE security_shifts DROP COLUMN shift_start');
        await connection.query('ALTER TABLE security_shifts DROP COLUMN shift_end');
        await connection.query('ALTER TABLE security_shifts ADD COLUMN days VARCHAR(255) NOT NULL');
        await connection.query('ALTER TABLE security_shifts ADD COLUMN start_time VARCHAR(10) NOT NULL');
        await connection.query('ALTER TABLE security_shifts ADD COLUMN end_time VARCHAR(10) NOT NULL');
        
        console.log("Schema updated successfully");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
