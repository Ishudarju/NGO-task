const db = require("../DB/db_connection");

const createAdmin = (name, email, hashedPassword, callback) => {
    const sql = "INSERT INTO admin_table (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hashedPassword], callback);
};

const getAdminByEmail = (email, callback) => {
    const sql = "SELECT * FROM admin_table WHERE email = ?";
    db.query(sql, [email], callback);
};

// const updatePassword = (email, hashedPassword, callback) => {
//     const sql = "UPDATE admin_table SET password = ? WHERE email = ?";
//     db.query(sql, [hashedPassword, email], callback);
// };

module.exports = { createAdmin, getAdminByEmail };
