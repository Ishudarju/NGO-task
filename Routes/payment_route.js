const express = require("express");
const router = express.Router();
const { initiatePayment, paymentResponse ,getAllPaymentsController,getPaymentByIdController} = require("../Controller/payment_controller");
const { verifyToken, isAdmin } = require('../Middleware/auth');

router.post("/pay", initiatePayment);
router.post("/payment-response", paymentResponse);
router.get("/getallpayment", getAllPaymentsController);
router.get("/getbyid/:id", getPaymentByIdController);

module.exports = router;
