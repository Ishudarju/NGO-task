
// const express = require("express");
// const cors = require("cors");
// // const bodyParser = require("body-parser");
// const crypto = require("crypto");
// const mysql = require("mysql2");
// require("dotenv").config();

// const app = express();
// app.use(cors());
// app.use(express.json()); // For JSON requests
// app.use(express.urlencoded({ extended: true })); // ✅ Add this for form data


// // Database Connection
// const db = mysql.createConnection({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASS || "",
//   database: process.env.DB_NAME || "donations",
// });

// db.connect((err) => {
//   if (err) console.error("❌ Database connection failed:", err);
//   else console.log("✅ Connected to database");
// });

// // Function to generate PayU Hash
// const generateHash = (data) => {
//   const string = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${process.env.PAYU_SALT}`;
//   return crypto.createHash("sha512").update(string).digest("hex");
// };

// // Route to initiate payment
// app.post("/pay", (req, res) => {
//   try {
//     const { name, email, phone, donationAmount } = req.body;
//     if (!name || !email || !phone || !donationAmount) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const txnid = "Txn" + new Date().getTime(); // Unique Transaction ID
//     const successUrl = `http://localhost:5000/payment-response`;
//     const failureUrl = `http://localhost:5000/payment-response`;

//     const paymentData = {
//       key: process.env.PAYU_MERCHANT_KEY,
//       txnid,
//       amount: donationAmount,
//       productinfo: "Donation",
//       firstname: name,
//       email,
//       phone,
//       surl: successUrl,
//       furl: failureUrl,
//       // service_provider: "payu_paisa",
//     };

//     // Generate secure hash
//     paymentData.hash = generateHash(paymentData);

//     res.json({
//       url: `${process.env.PAYU_BASE_URL}/_payment`,
//       data: paymentData,
//       status: true,
//     });
//   } catch (error) {
//     console.error("❌ Error in payment initiation:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });





// app.post("/payment-response", async (req, res) => {
//   try {
//     console.log("✅ Raw PayU Response:", req.body);

//     const payuResponse = req.body;
//     if (!payuResponse || Object.keys(payuResponse).length === 0) {
//       console.error("❌ Invalid response from PayU.");
//       return res.status(400).json({ error: "Invalid response from PayU." });
//     }

//     console.log("✅ PayU Response:", payuResponse);

//     const { txnid, amount, productinfo, firstname, email,phone, status, hash } = payuResponse;
//     if (!txnid || !status || !hash) {
//       console.error("❌ Missing required response fields.");
//       return res.status(400).json({ error: "Missing required response fields." });
//     }

//     // Recreate hash for verification (reverse order for response hash)
//     const hashString = `${process.env.PAYU_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${process.env.PAYU_MERCHANT_KEY}`;
//     const calculatedHash = crypto.createHash("sha512").update(hashString).digest("hex");

//     if (calculatedHash.toLowerCase() !== hash.toLowerCase()) {
//       console.error("❌ Hash mismatch! Payment response rejected.");
//       return res.status(400).json({ error: "Invalid hash verification." });
//     }

//     // Store transaction in the database using async/await
//     const query = "INSERT INTO payments (txnid, status, amount,name, email,phone) VALUES (?, ?, ?, ?,?,?)";
//     try {
//       await new Promise((resolve, reject) => {
//         db.query(query, [txnid, status, amount,firstname, email,phone], (err) => {
//           if (err) reject(err);
//           else resolve();
//         });
//       });

//       console.log("✅ Payment successfully saved!");

//       // Redirect user to success page
//       return res.redirect("http://localhost:5173/success");

//     } catch (dbError) {
//       console.error("❌ Failed to save payment response:", dbError);
//       return res.status(500).json({ error: "Database error" });
//     }

//   } catch (error) {
//     console.error("❌ Error in payment response handling:", error);
//     return res.status(500).json({ success: false, error: "Server error" });
//   }
// });
// // Start Express server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));










const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const paymentRoutes = require("./Routes/payment_route");
const authroutes= require("./Routes/admin_route");
const newsRoutes= require("./Routes/news_route");
const eventRoutes= require("./Routes/event_route");
const contactRoutes= require("./Routes/contact_route");
const { startStatusUpdater } = require("./Model/status_up");

const app = express();

app.use(cors({
    origin: '*', // Allow all origins (not recommended for production)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }));

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
startStatusUpdater();


// Routes
app.use("/pay", paymentRoutes);
app.use("/admin", authroutes);
app.use("/news",newsRoutes);
app.use("/event",eventRoutes);
app.use("/contact",contactRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
