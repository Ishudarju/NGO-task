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


// // Fetch all payments with filters and pagination

const getAllPayments = (page = 1, limit = 10, filters = {}) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    
    let query = "SELECT * FROM payments WHERE 1=1";
    let countQuery = "SELECT COUNT(*) AS total FROM payments WHERE 1=1";
    let queryParams = [];
    let countParams = [];

    // Filtering by name
    if (filters.name) {
      query += " AND name LIKE ?";
      countQuery += " AND name LIKE ?";
      queryParams.push(`%${filters.name}%`);
      countParams.push(`%${filters.name}%`);
    }

    // Filtering by status
    if (filters.status) {
      query += " AND status = ?";
      countQuery += " AND status = ?";
      queryParams.push(filters.status);
      countParams.push(filters.status);
    }

    // Filtering by date range (fixing the date issue)
    if (filters.fromDate && filters.toDate) {
      query += " AND created_at BETWEEN ? AND ?";
      countQuery += " AND created_at BETWEEN ? AND ?";
      queryParams.push(filters.fromDate + " 00:00:00", filters.toDate + " 23:59:59");
      countParams.push(filters.fromDate + " 00:00:00", filters.toDate + " 23:59:59");
    } else if (filters.fromDate) {
      query += " AND created_at >= ?";
      countQuery += " AND created_at >= ?";
      queryParams.push(filters.fromDate + " 00:00:00");
      countParams.push(filters.fromDate + " 00:00:00");
    } else if (filters.toDate) {
      query += " AND created_at <= ?";
      countQuery += " AND created_at <= ?";
      queryParams.push(filters.toDate + " 23:59:59");
      countParams.push(filters.toDate + " 23:59:59");
    }

    // Sorting by created_at (fixing the order issue)
    query += " ORDER BY created_at DESC";

    // Pagination
    query += " LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);

    // Execute count query
    db.query(countQuery, countParams, (err, countResult) => {
      if (err) return reject(err);

      const total = countResult[0].total;

      // Execute the main query
      db.query(query, queryParams, (err, results) => {
        if (err) reject(err);
        else resolve({ payments: results, total });
      });
    });
  });
};





// const getAllPayments = (page = 1, limit = 10) => {
//   return new Promise((resolve, reject) => {
//     const offset = (page - 1) * limit;
    
//     // Query to fetch payments with limit and offset
//     const query = "SELECT * FROM payments LIMIT ? OFFSET ?";
    
//     // Query to get total count of payments
//     const countQuery = "SELECT COUNT(*) AS total FROM payments";

//     db.query(countQuery, (err, countResult) => {
//       if (err) return reject(err);

//       const total = countResult[0].total;

//       db.query(query, [limit, offset], (err, results) => {
//         if (err) reject(err);
//         else resolve({ payments: results, total });
//       });
//     });
//   });
// };


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








