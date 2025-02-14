const express = require("express");
const { adminLogin, resetPassword, updatePassword } = require("../Controller/admin_controller");
const { verifyToken,isAdmin } = require("../Middleware/auth");

const router = express.Router();

router.post("/login",adminLogin);
router.post("/reset-password", resetPassword);
router.post("/update-password",updatePassword);

// router.post("login")

module.exports = router;
