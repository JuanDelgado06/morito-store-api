const Category = require('../models/category');
const vm = require('v-response');

const find =  async (req, res, next) => {
    try {
        const reg = await Category.findOne({_id: req.query.id})
        if(!reg) {
            res.status(404).send({
                message: "No existe este categoria"
            })
        }
        req.category = reg
    } catch (err) {
        res.status(500).send({
            message: "Ocurrio un error"
        })
        next(err);
    }
}
const create = async (req, res) => {
    try {
        const categoryDuplicate = await Category.findOne({type: req.body.type});

        if (categoryDuplicate) {
            console.log('Valor duplicado');
            return res.status(409).send({
                message: "Valor duplicado"
            })
        }

        const category = new Category();
        category.type = req.body.type

        const reg = await category.save();

        return res.status(200)
            .json(vm.ApiResponse(true, 200, " Nueva categoria creada", reg))
    } catch (err) {
        return res.status(500)
            .json(vm.ApiResponse(false, 500, err.message))
    }
};

const index = async (req, res) => {
    const reg = await Category.find();

    if(!reg) {
        return res.status(400)
            .json(vm.ApiResponse(false, 404, "Sin registros"))
    }

    return res.status(200)
        .json(vm.ApiResponse(true, 200, "", reg))
}

module.exports = {
    find,
    create,
    index
}