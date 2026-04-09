const mysql = require('mysql2/promise');

(async () => {
    try {
        const connection = await mysql.createConnection("mysql://root:@localhost:3306");
        console.log("Connected to MySQL server");
        await connection.query('DROP DATABASE IF EXISTS hommunity');
        console.log("Dropped old database");
        await connection.query('CREATE DATABASE hommunity');
        console.log("Created fresh database");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
