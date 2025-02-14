const Event = require("../Model/event_model");

exports.getAllEvents = (req, res) => {
    Event.getAllEvents((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
        
    });
};

exports.getEventById = (req, res) => {
    const { id } = req.params;
    Event.getEventById(id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Event not found" });
        res.json(results[0]);
    });
};

exports.createEvent = (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Image is required" });

    const { name, date_time, venue, description, status } = req.body;
    // console.log(req.body);
    const image = req.file.filename;

    const eventData = { name, date_time, venue, description, image, status };

    Event.createEvent(eventData, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Event created", id: result.insertId });
    });
};

exports.updateEvent = (req, res) => {
    const { id } = req.body;
    
    const { name, date_time, venue, description, status } = req.body;

    console.log(req.body);

    const image = req.file ? req.file.filename : req.body.image;

    const eventData = { name, date_time, venue, description, image, status };
    // console.log("eventdata",eventData);

    Event.updateEvent(id, eventData, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        // Fetch updated event after successful update
        Event.getEventById(id, (err, updatedEvent) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: "Event updated successfully",
                data: updatedEvent[0] // Return the updated event details
            });
        });// res.json({ message: "Event updated successfully" });
        
    });
};



exports.updateEventStatus = (req, res) => {
    Event.updateEventStatus((err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error updating event status" });
        }
        res.status(200).json({ message: "Event statuses updated successfully" });
    });
};


exports.deleteEvent = (req, res) => {
    const { id } = req.params;
    Event.deleteEvent(id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Event deleted successfully" });
    });
};
