const userController = require('../controllers/UserController.js');
const router = require('express').Router();
const verifyToken = require('../middlewares/verify-token');

//Signup Route
router.post('/auth/signup', userController.create);
//Profile Route
router.get('/auth/user', verifyToken, userController.profile);
//GET request - Obtenemos las reviews de cada usuario
router.get('/user/reviews', verifyToken, userController.reviews);
//Update route
router.put('/auth/user', verifyToken, userController.update);
//Login Route
router.post('/auth/login', userController.login)

module.exports = router;
