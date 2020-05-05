const categoryController = require('../controllers/CategoriesController');
const router = require('express').Router()

//POST request - Creamos un nuevo producto
router.post('/categories', categoryController.create);
//GET request - Obtenemos todos los productos
router.get('/categories', categoryController.index);
//router.get('/products', categoryController.index);
//GET request - Obtenemos un unico producto

//PUT  request - Actualizar un producto 

//DELETE request - Eliminar un producto

module.exports = router;