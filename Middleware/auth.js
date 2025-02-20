const jwt = require("jsonwebtoken");
require("dotenv").config();
const rateLimit = require("express-rate-limit"); // Import express-rate-limit

const verifyToken = (req, res, next) => {
    console.log("📥 Request Headers:", req.headers); // Debugging

    const token = req.headers["authorization"]; // Directly get the token

    if (!token) {
        console.log("❌ No Token Found");
        return res.status(403).json({ message: "Access Denied. No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded Token:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("❌ Token Verification Failed:", error.message);
        return res.status(401).json({ message: "Invalid Token" });
    }
};



const isAdmin = (req, res, next) => {
    console.log("User Role:", req.user?.role); // Debugging log

    if (!req.user || !req.user.role) {
        console.log("❌ No role found in token");
        return res.status(403).json({ message: "No role found in token" });
    }

    if (req.user.role !== "admin") {
        console.log("❌ User is not an admin");
        return res.status(403).json({ message: "Admin Access Only" });
    }
    console.log("✅ User is an admin");
    next();
};


// ** Rate Limiter for Admin Login (for security) **
const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 5 requests per window
    message: "Too many login attempts from this IP, please try again after 15 minutes",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });



module.exports = { verifyToken, isAdmin ,loginRateLimiter};
