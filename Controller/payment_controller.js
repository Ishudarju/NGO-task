const crypto = require("crypto");
const { savePayment } = require("../Model/payment_model");

const generateHash = (data, salt) => 
{
  const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${salt}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
};

// ✅ Initiate Payment (Sends Request to PayU)
const initiatePayment = async (req, res) => {
  try {
    const { name, email, phone, donationAmount } = req.body;
    if (!name || !email || !phone || !donationAmount) 
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
      productinfo: "Donation",
      firstname: name,
      email,
      phone,
      surl: successUrl,
      furl: failureUrl,
    };

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
    const calculatedHash = crypto.createHash("sha512").update(hashString).digest("hex");

    console.log("🔍 Expected Hash:", calculatedHash);
    console.log("🔍 Received Hash:", hash);

    if (calculatedHash.toLowerCase() !== hash.toLowerCase()) {
      return res.status(400).json({ error: "Invalid hash verification." });
    }

    // ✅ Save Payment in Database
    await savePayment({ txnid, status, amount, name: firstname, email, phone });

    console.log("✅ Payment successfully saved!");
    return res.redirect("http://localhost:5173/success");

  } catch (error) {
    console.error("❌ Error in payment response handling:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { initiatePayment, paymentResponse };
