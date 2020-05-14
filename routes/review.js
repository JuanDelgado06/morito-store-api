const reviewController = require('../controllers/ReviewController.js');
const router = require('express').Router();
const uploadMiddleware = require('../middlewares/upload');
const verifyToken = require('../middlewares/verify-token');
const reviewDuplicate = require('../middlewares/review-duplicate');

//POST request - Creamos una nueva reseña
router.post('/reviews/:productId', verifyToken, reviewDuplicate, uploadMiddleware.array("photo_review", 6), reviewController.create);
//GET request - Obtenemos todos las reseñas de un producto
router.get('/reviews/:productId', reviewController.index);

module.exports = router;