const mysql = require("mysql2");
require("dotenv").config();

// Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "donations",
  waitForConnections: true,
  connectionLimit: 10,  // Adjust this as per load
  queueLimit: 0
});

db.connect((err) => {
  if (err) console.error("❌ Database connection failed:", err);
  else console.log("✅ Connected to database");
});

module.exports = db;
