const mysql = require("mysql2/promise");  // ✅ Use mysql2/promise
require("dotenv").config();

const db = mysql.createPool({   // ✅ Use createPool() instead of createConnection()
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection()
    .then(() => console.log("Connected to MySQL Database"))
    .catch((err) => console.log("Database connection failed: " + err.stack));

module.exports = db;
