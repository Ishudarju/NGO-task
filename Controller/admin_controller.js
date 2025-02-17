const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Admin = require("../Model/admin_model");
require("dotenv").config();

// ** Password Validation Function **
const validatePassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// ** Admin Login **
exports.adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  Admin.getAdminByEmail(email, async (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (result.length === 0)
      return res.status(404).json({ message: "Admin not found" });

    const admin = result[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin.id, role: admin.role, email: admin.email, name: admin.name
        
       },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    res.json({ message: "Login successful", token });
  });
};

// ** Reset Password via Email **

exports.resetPassword = (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  Admin.getAdminByEmail(email, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const resetLink = `http://yourfrontend.com/reset-password/${token}`;

    console.log("Generated Reset Link:", resetLink);

    let transporter = nodemailer.createTransport({
      host: "mail.evvisolutions.com", // ✅ Replace with your actual SMTP host
      port: 465, // ✅ Use the correct port (465 for SSL, 587 for TLS)
      secure: true, // ✅ True for port 465, false for port 587
      auth: {
        user: process.env.EMAIL_USER, // ✅ Your Webmail email (test@evvisolutions.com)
        pass: process.env.EMAIL_PASS, // ✅ Your Webmail password (Welcome@1234)
      },
    });

    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email sending failed:", error);
        return res
          .status(500)
          .json({ message: "Email sending failed", error: error.message });
      }
      console.log("Email sent:", info.response);
      res.json({ message: "Reset link sent to your email" });
    });
  });
};

// ** Update Password **
exports.updatePassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!newPassword)
    return res.status(400).json({ message: "New password is required" });

  if (!validatePassword(newPassword)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    Admin.updatePassword(decoded.email, hashedPassword, (err) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json({ message: "Password updated successfully" });
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
