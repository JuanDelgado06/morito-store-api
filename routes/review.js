const reviewController = require('../controllers/ReviewController.js');
const router = require('express').Router();
const verifyToken = require('../middlewares/verify-token');
const reviewDuplicate = require('../middlewares/review-duplicate');

//POST request - Creamos una nueva reseña
router.post('/reviews/:productId', verifyToken, reviewDuplicate, reviewController.create);
//GET request - Obtenemos todos las reseñas de un producto
router.get('/reviews/:productId', reviewController.index);
//Actualizar un review
router.put('/reviews/update/:reviewId', verifyToken, reviewController.update);
//Eliminar un review 
router.delete('/reviews/remove/:reviewId', verifyToken, reviewController.destroy)

module.exports = router;