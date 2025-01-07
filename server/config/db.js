const mysql = require("mysql2/promise"); // Use promise-based mysql2
 
const mysqlPool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "student_portal",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = mysqlPool;
