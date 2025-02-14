const Event = require("./event_model");  // Ensure correct path

const updateEventStatusAutomatically = () => {
    Event.updateEventStatus((err, result) => {
        if (err) {
            console.error("❌ Error updating event status:", err);
        } else {
            console.log("✅ Event statuses updated successfully");
        }
    });
};

// Ensure the function runs only once
let intervalStarted = false;
const startStatusUpdater = () => {
    if (!intervalStarted) {
        intervalStarted = true;
        setInterval(updateEventStatusAutomatically, 60000);  // Run every 1 min
    }
};

module.exports = { startStatusUpdater };
