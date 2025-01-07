const mysql = require("mysql2/promise"); // Use promise-based mysql2
 
const mysqlPool = mysql.createPool({
    host: "",
    user: "",
    password: "",
    database: "",
    waitForConnections: ,
    connectionLimit: ,
    queueLimit: ,
});

module.exports = mysqlPool;
