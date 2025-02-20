const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const paymentRoutes = require("./Routes/payment_route");

const authroutes= require("./Routes/admin_route");
const newsRoutes= require("./Routes/news_route");
const eventRoutes= require("./Routes/event_route");
const contactRoutes= require("./Routes/contact_route");
// const { startStatusUpdater } = require("./Model/status_up");

const app = express();

app.use(
  cors({
    origin: "*", // Allow all origins (not recommended for production)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// startStatusUpdater();

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
// Routes
app.use("/pay", paymentRoutes);
app.use("/admin", authroutes);
app.use("/news",newsRoutes);
app.use("/event",eventRoutes);
app.use("/contact",contactRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
