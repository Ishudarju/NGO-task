const express = require("express");
const router = express.Router();
const { initiatePayment, paymentResponse } = require("../Controller/payment_controller");

router.post("/pay", initiatePayment);
router.post("/payment-response", paymentResponse);

module.exports = router;
