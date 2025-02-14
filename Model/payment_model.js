const db = require("../DB/db_connection");

// Function to save payment details
const savePayment = (paymentData) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO payments (txnid, status, amount, name, email, phone) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [paymentData.txnid, paymentData.status, paymentData.amount, paymentData.name, paymentData.email, paymentData.phone];

    db.query(query, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

module.exports = { savePayment };
