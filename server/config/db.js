const mysql = require("mysql2");
require("dotenv").config();

console.log("📡 Intentando conectar a MySQL...");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

pool.getConnection((err, connection) => {
    if (err) {
        console.log("❌ ERROR MYSQL:");
        console.log(err.message);
    } else {
        console.log("✅ CONEXIÓN MYSQL OK:", process.env.DB_NAME);
        connection.release();
    }
});

module.exports = pool;