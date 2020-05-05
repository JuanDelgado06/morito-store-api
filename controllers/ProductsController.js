const Product = require('../models/product');
const _ = require('underscore')
const fs = require('fs')
const upload = require('../helpers/helper').upload;
const vm = require('v-response');

//Middleware para buscar un producto y guargarlo en el req.product
const find =  async (req, res, next) => {
    try {
        const reg = await Product.findOne({_id: req.params.id})
        if (!reg) {
            return res.status(404)
                .json(vm.ApiResponse(false, 404, 'No existe el producto'))
        }
        req.product = reg;
        next();
    } catch (error) {
        next(error);
    }
}   
//Crear Producto
const create = async (req, res, next) => {
    if (!req.files || _.isEmpty(req.files) ) {
        const reg = await Product.create(req.body);

        if (!reg) {
            return res.status(400)
                .json(vm.ApiResponse(false, 400, 'No se envio ninguna información'))
        }
        req.product = reg;
        return res.json(reg)
    }
    const files = req.files;
    try {
        let urls = [];
        let multiple = async (path) => await upload(path);
        for (const file of files) {
            const {path} = file;
            console.log("path", file);
            
            const newPath = await multiple(path);
            urls.push(newPath);
            fs.unlinkSync(path);
        }
        if (urls) {
            let body = req.body
            let bodyw = _.extend(body, {photo_products: urls});
            let product = new Product(bodyw);
            await product.save()
                .then(productSaved => {
                    req.product = productSaved
                    return  res.json(productSaved)
                }).catch(err => {
                    console.log(err);
                    return res.json(err);
                })
        }
        if (!urls) {
            return res.status(400)
                .json(vm.ApiResponse(false, 400, "No urls", req.product))
        }
    } catch (err) {
        console.log("err :", err);
        return next(err);
    }
};
//Actualizar producto
const update = async (req, res, next) => {
    try {
        //Contruimos un nuevo producto
        const newProduct = req.body;
        //Verificamon si estan enviando imagenes
        if(req.files) {
            const files = req.files;
            let urls = [];

            let multiple = async (path) => await upload(path);
            for (const file of files) {
                const {path} = file;
                console.log("path", file);
                
                const newPath = await multiple(path);
                urls.push(newPath);
                fs.unlinkSync(path);
            }
            if (urls) {
                newProduct.photo_products = urls;
            }
        } // SI no se envia nuevas imagenes
        else {
            let oldProduct = await Product.findById(req.params.id)
            newProduct.photo_products = oldProduct.photo_products;
        }
        //Actualizamos el producto
        const product = await Product.findOneAndUpdate({_id: req.params.id}, newProduct, {
            new: true,
            runValidators : true, 
            useFindAndModify: false
        })

        return res.status(200)
            .json(vm.ApiResponse(true, 200, "Producto actualizado", product))
    } catch (err) {
        console.log(err);
        next(err);
    }
}
//Obtener todos los productos
const index = async (req, res) => {
    //Con el metodo populate traemos toda la informacion de "owner" y "category" y no solo su id
    const reg = await Product.find().populate("owner category").exec();

    if(!reg) {
        return res.status(404)
            .json(vm.ApiResponse(false, 404, "Sin registros"))
    }

    return res.status(200)
        .json(vm.ApiResponse(true, 200, "", reg))
}
//Obtener un producto con el Id utilizando el middleware "find"
const showOne = (req, res) => {
    return res.status(200)
        .json(vm.ApiResponse(true, 200, "", req.product))
}
//Eliminar un producto con el id utilizando el middleware "find"
const destroy = async (req, res) => {
    const reg = await req.product.remove()

    if (!reg) {
        return res.status(500)
            .json(vm.ApiResponse(true, 500, "No se pudo eliminar"))
    }

    return res.status(200)
        .json(vm.ApiResponse(true, 200, "Producto eliminado"))
}

module.exports = {
    find,
    create,
    index,
    showOne,
    update,
    destroy
}