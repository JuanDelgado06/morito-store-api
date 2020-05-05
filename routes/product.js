const productController = require('../controllers/ProductsController');
const router = require('express').Router()
const uploadMiddleware = require('../middlewares/upload')

//POST request - Creamos un nuevo producto
router.post('/products', uploadMiddleware.array("photo_products", 6), productController.create);
//GET request - Obtenemos todos los productos
router.get('/products', productController.index);
//GET request - Obtenemos un unico producto
router.get('/products/:id', productController.find, productController.showOne);
//PUT  request - Actualizar un producto
router.put('/products/:id', uploadMiddleware.array("photo_products", 6), productController.find, productController.update);
//DELETE request - Eliminar un producto
router.delete('/products/:id', productController.find, productController.destroy);

module.exports = router;