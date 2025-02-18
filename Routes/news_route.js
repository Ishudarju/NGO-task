
const express = require('express');
const multer = require('multer');
const router = express.Router();
const newsController = require('../Controller/news_controller');
const { verifyToken, isAdmin } = require('../Middleware/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ storage, fileFilter });

router.get('/getAll_news', newsController.getAllNews);
router.get('/get_news/:id', verifyToken, isAdmin, newsController.getNewsById);
router.post('/create_news', verifyToken, isAdmin, upload.single('image'), newsController.createNews);
router.put('/update_news/:id', verifyToken, isAdmin, upload.single('image'), newsController.updateNews);
router.delete('/delete_news/:id', verifyToken, isAdmin, newsController.deleteNews);

module.exports = router;
