const express = require("express");
const { adminLogin, resetPassword, updatePassword } = require("../Controller/admin_controller");
const { verifyToken,isAdmin,loginRateLimiter  } = require("../Middleware/auth");

const router = express.Router();

router.post("/login",loginRateLimiter,adminLogin);
// router.post("/reset-password",loginRateLimiter , resetPassword);
// router.post("/update-password",loginRateLimiter ,updatePassword);

// router.post("login")

module.exports = router;
