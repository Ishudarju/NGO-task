const express = require("express");
const router = express.Router();
const { initiatePayment, paymentResponse ,getAllPaymentsController,getPaymentByIdController} = require("../Controller/payment_controller");
const { verifyToken, isAdmin ,loginRateLimiter} = require('../Middleware/auth');

router.post("/pay", initiatePayment);
router.post("/payment-response", paymentResponse);
router.get("/getallpayment",loginRateLimiter,verifyToken,isAdmin, getAllPaymentsController);
router.get("/getbyid/:id", loginRateLimiter,verifyToken,isAdmin,getPaymentByIdController);

module.exports = router;
