const jwt = require("jsonwebtoken");
require("dotenv").config();

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



module.exports = { verifyToken, isAdmin };
