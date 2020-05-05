const ownerController = require('../controllers/OwnersController');
const router = require('express').Router();
const uploadMiddleware = require('../middlewares/upload')

//POST request - Creamos un nuevo producto
router.post('/owners', uploadMiddleware.array("photo", 1), ownerController.create);
//GET request - Obtenemos todos los productos
router.get('/owners', ownerController.index);
//GET request - Obtenemos un unico producto

//PUT  request - Actualizar un producto 

//DELETE request - Eliminar un producto

module.exports = router;