// const db = require('../DB/db_connection');

// const News = {
//     getAll: async () => {
//         return new Promise((resolve, reject) => {
//             db.query('SELECT * FROM news', (err, results) => {
//                 if (err) reject(err);
//                 resolve(results);
//             });
//         });
//     },

//     getById: async (id) => {
//         return new Promise((resolve, reject) => {
//             db.query('SELECT * FROM news WHERE id = ?', [id], (err, result) => {
//                 if (err) reject(err);
//                 resolve(result[0]);
//             });
//         });
//     },

//     create: async (data) => {
//         return new Promise((resolve, reject) => {
//             db.query(
//                 'INSERT INTO news (title, text, description, image) VALUES (?, ?, ?, ?)',
//                 [data.title, data.text, data.description, data.image],
//                 (err, result) => {
//                     if (err) reject(err);
//                     resolve({ message: 'News added successfully', id: result.insertId });
//                 }
//             );
//         });
//     },
  


//     update: async (id, data) => {
//         return new Promise((resolve, reject) => {
//             db.query(
//                 `UPDATE news 
//                  SET title = ?, text = ?, description = ?, image = ?, updated_at = NOW() 
//                  WHERE id = ?`,
//                 [data.title, data.text, data.description, data.image, id],
//                 (err, result) => {
//                     if (err) {
//                         console.error("MySQL Update Error:", err);
//                         return reject({ error: "Database update failed" });
//                     }
    
//                     console.log("Update Result:", result); // Debugging line
    
//                     if (result.affectedRows === 0) {
//                         return resolve({ error: "News not found or no changes made" });
//                     }
    
//                     resolve({ message: "News updated successfully", affectedRows: result.affectedRows });
//                 }
//             );
//         });
//     },
    
    
//     delete: async (id) => {
//         return new Promise((resolve, reject) => {
//             db.query('DELETE FROM news WHERE id = ?', [id], (err, result) => {
//                 if (err) reject(err);
//                 resolve({ message: 'News deleted successfully', affectedRows: result.affectedRows });
//             });
//         });
//     }
// };

// module.exports = News;

const db = require('../DB/db_connection');

const News = {
    getAll: async (limit, offset) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM news LIMIT ? OFFSET ?`;
            db.query(query, [parseInt(limit), parseInt(offset)], (err, results) => {
                if (err) return reject(err);

                // Count total news
                db.query('SELECT COUNT(*) AS total FROM news', (countErr, countResult) => {
                    if (countErr) return reject(countErr);
                    resolve({ news: results, total: countResult[0].total });
                });
            });
        });
    },



    getById: async (id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM news WHERE id = ?', [id], (err, result) => {
                if (err) reject(err);
                resolve(result[0] || null);
            });
        });
    },

    create: async (data) => {
        return new Promise((resolve, reject) => {
            if (!data.title || !data.text || !data.description || !data.image) {
                return reject({ error: 'All fields are required' });
            }

            db.query(
                'INSERT INTO news (title, text, description, image) VALUES (?, ?, ?, ?)',
                [data.title, data.text, data.description, data.image],
                (err, result) => {
                    if (err) reject(err);
                    resolve({ message: 'News added successfully', id: result.insertId });
                }
            );
        });
    },

    update: async (id, data) => {
        return new Promise((resolve, reject) => {
            if (!id) return reject({ error: 'News ID is required' });

            const fields = [];
            const values = [];

            Object.keys(data).forEach((key) => {
                if (data[key] !== undefined) {
                    fields.push(`${key} = ?`);
                    values.push(data[key]);
                }
            });

            if (fields.length === 0) return reject({ error: 'At least one field is required for update' });

            values.push(id);

            const query = `UPDATE news SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;

            db.query(query, values, (err, result) => {
                if (err) reject({ error: 'Database update failed' });

                if (result.affectedRows === 0) {
                    resolve({ error: 'News not found or no changes made' });
                } else {
                    resolve({ message: 'News updated successfully', affectedRows: result.affectedRows });
                }
            });
        });
    },

    delete: async (id) => {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM news WHERE id = ?', [id], (err, result) => {
                if (err) reject(err);
                resolve({ message: 'News deleted successfully', affectedRows: result.affectedRows });
            });
        });
    }
};

module.exports = News;
