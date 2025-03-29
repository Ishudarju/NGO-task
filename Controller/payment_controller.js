const crypto = require("crypto");
const { savePayment,getAllPayments,getPaymentById  } = require("../Model/payment_model");

const generateHash = (data, salt) => 
{
  const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${salt}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
};

// ✅ Initiate Payment (Sends Request to PayU)
const initiatePayment = async (req, res) => {
  try {
    const { name, email, phone, donationAmount ,description} = req.body;

    console.log("payment",req.body);

    if (!name || !email || !phone || !donationAmount ||!description) 
    {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const txnid = "Txn" + new Date().getTime();
    const successUrl = `http://localhost:5000/pay/payment-response`;
    const failureUrl = `http://localhost:5000/pay/payment-response`;

    const paymentData = {
      key: process.env.PAYU_MERCHANT_KEY,
      txnid,
      amount: donationAmount,
      productinfo: description,
      firstname: name,
      email,
      phone,
      surl: successUrl,
      furl: failureUrl,
    };

   console.log("paydata",paymentData); 

    // ✅ Generate Hash using Merchant Key and Salt
    paymentData.hash = generateHash(paymentData, process.env.PAYU_SALT);

    res.json({
      url: `${process.env.PAYU_BASE_URL}/_payment`,
      data: paymentData,
      status: true,
    });
  } catch (error) {
    console.error("❌ Error in payment initiation:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Handle PayU Payment Response
const paymentResponse = async (req, res) => {
  try {
    console.log("✅ Raw PayU Response:", req.body);

    const { txnid, amount, productinfo, firstname, email, phone, status, hash } = req.body;

    if (!txnid || !status || !hash) {
      return res.status(400).json({ error: "Missing required response fields." });
    }

    // ✅ Recreate Hash for Verification
    const hashString = `${process.env.PAYU_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${process.env.PAYU_MERCHANT_KEY}`;
    // console.log("🔍 Hash String:", process.env.PAYU_MERCHANT_KEY);
    const calculatedHash = crypto.createHash("sha512").update(hashString).digest("hex");

    console.log("🔍 Expected Hash:", calculatedHash);
    console.log("🔍 Received Hash:", hash);

    if (calculatedHash.toLowerCase() !== hash.toLowerCase()) {
      return res.status(400).json({ error: "Invalid hash verification." });
    }

    // ✅ Save Payment in Database
    await savePayment({ txnid, status, amount, name: firstname, email, phone , productinfo});

    // console.log("✅ Payment successfully saved!");
    // return res.redirect("http://localhost:5173/success");
    console.log("✅ Payment successfully saved!");

     // ✅ Redirect based on payment status
     if (status.toLowerCase() === "success") {
      return res.redirect("http://localhost:5173/success");
    } else {
      return res.redirect("http://localhost:5173/failure");
    }

  } catch (error) {
    console.error("❌ Error in payment response handling:", error);
    return res.status(500).json({ error: "Server error" });
  }
};


// const getAllPaymentsController = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;  // Default to page 1
//     const limit = parseInt(req.query.limit) || 10; // Default limit to 10

//     const { payments, total } = await getAllPayments(page, limit);

//     res.json({
//       status: true,
//       payments,
//       total,
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//     });
//   } catch (error) {
//     console.error("❌ Error fetching payments:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };



// Controller to get all payments
const getAllPaymentsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;  // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit to 10

    const filters = {
      name: req.query.name || null,
      status: req.query.status || null,
      fromDate: req.query.fromDate || null,
      toDate: req.query.toDate || null,
    };

    const { payments, total } = await getAllPayments(page, limit, filters);

    res.json({
      status: true,
      payments,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ Error fetching payments:", error);
    res.status(500).json({ error: "Server error" });
  }
};




// // ✅ Get all payments
// const getAllPaymentsController = async (req, res) => {
//   try {
//     const payments = await getAllPayments();
//     res.json({ status: true, payments });
//   } catch (error) {
//     console.error("❌ Error fetching payments:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// ✅ Get payment by ID
const getPaymentByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await getPaymentById(id);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.json({ status: true, payment });
  } catch (error) {
    console.error("❌ Error fetching payment by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { initiatePayment, paymentResponse,getPaymentByIdController,getAllPaymentsController };













