const db = require("../DB/db_connection");


const Event = {
    getAllEvents: (callback) => {
        db.query("SELECT * FROM events", callback);
    },

    getEventById: (id, callback) => {
        db.query("SELECT * FROM events WHERE id = ?", [id], callback);
    },

    createEvent: (eventData, callback) => {
        const { name, date_time, venue, description, image} = eventData;
        let status = "open";
        const sql = "INSERT INTO events (name, date_time, venue, description, image, status) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(sql, [name, date_time, venue, description, image, status], callback);
    },

//     updateEventStatus: (callback) => {
//         const now = new Date();

//         // Update status to "ongoing" when event time starts
//         const ongoingQuery = `
//             UPDATE events 
//             SET status = 'ongoing' 
//             WHERE status = 'open' AND date_time <= ?`;

//         db.query(ongoingQuery, [now], (err, result) => {
//             if (err) console.error("Error updating status to 'ongoing':", err);
//         });

//         // Update status to "close" after 8 hours
//         const closeQuery = `
//             UPDATE events 
//             SET status = 'close' 
//             WHERE status = 'ongoing' AND TIMESTAMPDIFF(HOUR, date_time, ?) >= 8`;

//         db.query(closeQuery, [now], (err, result) => {
//             if (err) console.error("Error updating status to 'close':", err);
//         });

//         if (callback) callback();
//     },

//     // Function to update event statuses every minute
//  startStatusUpdater: () => {
//     setInterval(() => {
//         Event.updateEventStatus();
//     }, 60 * 1000); // Runs every 1 minute
// },

 


    updateEvent: (id, eventData, callback) => {
        const { name, date_time, venue, description, image, status } = eventData;
        // console.log("model",eventData);
        const sql = "UPDATE events SET name=?, date_time=?, venue=?, description=?, image=?, status=? WHERE id=?";
        db.query(sql, [name, date_time, venue, description, image, status, id], callback);
    },

    deleteEvent: (id, callback) => {
        db.query("DELETE FROM events WHERE id = ?", [id], callback);
    },


    updateEventStatus: (callback) => {
        const now = new Date();
        const eightHoursAgo = new Date(now.getTime() - 8 * 60 * 60 * 1000);

        const sql = `
            UPDATE events 
            SET status = 
                CASE 
                    WHEN date_time <= ? AND date_time >= ? THEN 'ongoing'
                    WHEN date_time < ? THEN 'closed'
                    ELSE status
                END
        `;
        
        db.query(sql, [now, eightHoursAgo, eightHoursAgo], callback);
    },
};


// // Function to update event statuses automatically
// const updateEventStatus = () => {
//     const now = new Date();

//     // Change status to 'ongoing' when event starts
//     const ongoingQuery = `
//         UPDATE events 
//         SET status = 'ongoing' 
//         WHERE status = 'open' AND date_time <= ?`;

//     db.query(ongoingQuery, [now], (err, result) => {
//         if (err) console.error("Error updating status to 'ongoing':", err);
//     });

//     // Change status to 'close' after 8 hours of event start time
//     const closeQuery = `
//         UPDATE events 
//         SET status = 'close' 
//         WHERE status = 'ongoing' AND TIMESTAMPDIFF(HOUR, date_time, ?) >= 8`;

//     db.query(closeQuery, [now], (err, result) => {
//         if (err) console.error("Error updating status to 'close':", err);
//     });
// };

// // Run the status update function every 1 minute
// setInterval(updateEventStatus, 60 * 1000);

module.exports = Event;
