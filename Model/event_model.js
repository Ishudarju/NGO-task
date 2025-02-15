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




    updateEvent: (id, eventData, callback) => {
        const { name, date_time, venue, description, image, status } = eventData;
        // console.log("model",eventData);
        const sql = "UPDATE events SET name=?, date_time=?, venue=?, description=?, image=?, status=? WHERE id=?";
        db.query(sql, [name, date_time, venue, description, image, status, id], callback);
    },

    deleteEvent: (id, callback) => {
        db.query("DELETE FROM events WHERE id = ?", [id], callback);
    },


    // updateEventStatus: (callback) => {
    //     const now = new Date();
    //     const eightHoursAgo = new Date(now.getTime() - 8 * 60 * 60 * 1000);

    //     const sql = `
    //         UPDATE events 
    //         SET status = 
    //             CASE 
    //                 WHEN date_time <= ? AND date_time >= ? THEN 'ongoing'
    //                 WHEN date_time < ? THEN 'closed'
    //                 ELSE status
    //             END
    //     `;
        
    //     db.query(sql, [now, eightHoursAgo, eightHoursAgo], callback);
    // },

    updateEventStatus: (callback) => {
        const now = new Date();
        const eightHoursAgo = new Date(now.getTime() - 8 * 60 * 60 * 1000);
    
        const sql = `
            UPDATE events 
            SET status = 
                CASE 
                    WHEN date_time <= ? AND status = 'open' THEN 'ongoing'
                    WHEN date_time <= ? AND status = 'ongoing' THEN 'closed'
                    ELSE status
                END
        `;
    
        db.query(sql, [now, eightHoursAgo], callback);
    }
    
};




module.exports = Event;
