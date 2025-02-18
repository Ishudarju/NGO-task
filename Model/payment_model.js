const db = require("../DB/db_connection");

// Function to save payment details
const savePayment = (paymentData) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO payments (txnid, status, amount, name, email, phone,reason) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [paymentData.txnid, paymentData.status, paymentData.amount, paymentData.name, paymentData.email, paymentData.phone,paymentData.productinfo];

    db.query(query, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};


// const getAllPayments = () => {
//   return new Promise((resolve, reject) => {
//     const query = "SELECT * FROM payments";
//     db.query(query, (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// };

const getAllPayments = (page = 1, limit = 10) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    
    // Query to fetch payments with limit and offset
    const query = "SELECT * FROM payments LIMIT ? OFFSET ?";
    
    // Query to get total count of payments
    const countQuery = "SELECT COUNT(*) AS total FROM payments";

    db.query(countQuery, (err, countResult) => {
      if (err) return reject(err);

      const total = countResult[0].total;

      db.query(query, [limit, offset], (err, results) => {
        if (err) reject(err);
        else resolve({ payments: results, total });
      });
    });
  });
};


// ✅ Function to fetch payment by ID
const getPaymentById = (id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM payments WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) reject(err);
      else resolve(results[0]); // Return a single payment record
    });
  });
};

module.exports = { savePayment, getAllPayments, getPaymentById };








