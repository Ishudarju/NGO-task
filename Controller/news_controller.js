// const News = require('../Model/news_model');
// const db = require('../DB/db_connection');

// exports.getAllNews = async (req, res) => {
//     try {
//         const news = await News.getAll();
//         res.status(200).json(news);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to retrieve news' });
//     }
// };

// exports.getNewsById = async (req, res) => {
//     try {
//         const news = await News.getById(req.params.id);
//         if (!news) return res.status(404).json({ error: 'News not found' });
//         res.status(200).json(news);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to retrieve news' });
//     }
// };

// exports.createNews = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: 'Image is required' });
//         }

//         const { title, text, description } = req.body;
//         const image = req.file.path; // Save file path

//         const result = await News.create({ title, text, description, image });
//         res.status(201).json(result);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to add news' });
//     }
// };



// exports.updateNews = async (req, res) => { 
//     try {
//         const { title, text, description } = req.body;
//         const id = req.params.id || req.body.id;  // Ensure ID is passed

//         if (!id) return res.status(400).json({ error: "News ID is required" });

//         // Get the uploaded file (if exists)
//         const image = req.file ? req.file.filename : null;

//         console.log("Updating news with ID:", id);
//         console.log("New Data:", { title, text, description, image });

//         // Fetch existing image from DB if no new image is provided
//         let existingImageQuery = `SELECT image FROM news WHERE id = ?`;
//         db.query(existingImageQuery, [id], async (err, results) => {
//             if (err) {
//                 console.error("Error fetching existing image:", err);
//                 return res.status(500).json({ error: "Database query failed" });
//             }

//             const existingImage = results.length > 0 ? results[0].image : null;
//             const finalImage = image || existingImage;  // Use new image if uploaded, otherwise keep old

//             // Update the news item
//             const updateResult = await News.update(id, { title, text, description, image: finalImage });

//             if (updateResult.error) {
//                 return res.status(404).json(updateResult);
//             }

//             res.status(200).json({ message: "News updated successfully", affectedRows: updateResult.affectedRows });
//         });
//     } catch (error) {
//         console.error("Update Error:", error);
//         res.status(500).json({ error: "Failed to update news" });
//     }
// };





// exports.deleteNews = async (req, res) => {
//     try {
//         const result = await News.delete(req.params.id);
//         res.status(200).json(result);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to delete news' });
//     }
// };



const News = require('../Model/news_model');
const db = require('../DB/db_connection');

exports.getAllNews = async (req, res) => {
    try {
        let { page, limit } = req.query;

        // Default values if not provided
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 5; // Show 10 news per page
        const offset = (page - 1) * limit;

        const result = await News.getAll(limit, offset);

        const totalPages = Math.ceil(result.total / limit);

        res.status(200).json({
            totalNews: result.total,
            totalPages: totalPages,
            currentPage: page,
            newsPerPage: limit,
            news: result.news
        });
    } catch (error) {
        console.error("Pagination Error:", error);
        res.status(500).json({ error: 'Failed to retrieve news' });
    }
};


exports.getNewsById = async (req, res) => {
    try {
        const news = await News.getById(req.params.id);
        if (!news) return res.status(404).json({ error: 'News not found' });
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve news' });
    }
};

exports.createNews = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Image is required' });
        }

        const { title, text, description } = req.body;
        if (!title || !text || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const image = req.file.path;
        const result = await News.create({ title, text, description, image });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.error || 'Failed to add news' });
    }
};

exports.updateNews = async (req, res) => {
    try {
        const { title, text, description } = req.body;
        const id = req.params.id;

        if (!id) return res.status(400).json({ error: 'News ID is required' });

        const image = req.file ? req.file.path : null;

        let existingImageQuery = 'SELECT image FROM news WHERE id = ?';
        db.query(existingImageQuery, [id], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database query failed' });
            }

            const existingImage = results.length > 0 ? results[0].image : null;
            const finalImage = image || existingImage;

            const updateResult = await News.update(id, { title, text, description, image: finalImage });

            if (updateResult.error) {
                return res.status(404).json(updateResult);
            }

            res.status(200).json({ message: 'News updated successfully', affectedRows: updateResult.affectedRows });
        });
    } catch (error) {
        res.status(500).json({ error: error.error || 'Failed to update news' });
    }
};

exports.deleteNews = async (req, res) => {
    try {
        const result = await News.delete(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'News not found' });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete news' });
    }
};
