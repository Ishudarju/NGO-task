const express = require("express");
const multer = require("multer");
const path = require("path");
const eventController = require("../Controller/event_controller");

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Ensure uploads folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + path.extname(file.originalname));
    },
});

// File Filter (Allow only images)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max file size
});

// Event Routes
router.get("/AllEvent", eventController.getAllEvents);
// Route to get an event by ID
router.get("/events/:id", eventController.getEventById);
router.post("/createEve", upload.single("image"), eventController.createEvent);
router.put("/updateEve", upload.single("image"), eventController.updateEvent);
router.delete("/delEve/:id", eventController.deleteEvent);
router.get("/update-status", eventController.updateEventStatus);

module.exports = router;
