const Owner = require('../models/owner');
const _ = require('underscore')
const fs = require('fs')
const upload = require('../helpers/helper').upload;
const vm = require('v-response');

const find =  async (req, res, next) => {
    try {
        const reg = await Owner.findOne({_id: req.query.id})
        if(!reg) {
            res.status(404).send({
                message: "No existe este categoria"
            })
        }
        req.owner = reg
    } catch (err) {
        res.status(500).send({
            message: "Ocurrio un error"
        })
        next(err);
    }
}
const create = async (req, res) => {
    try {
        if (!req.files || _.isEmpty(req.files) ) {
            const reg = await Owner.create(req.body);

            if (!reg) {
                return res.status(404)
                    .json(vm.ApiResponse(false, 404, 'No se envio ninguna información'))
            }
            req.owner = reg;
            return res.json(reg)
        }
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
            let body = req.body
            let bodyw = _.extend(body, {photo: urls});
            let owner = new Owner(bodyw);
            await owner.save()
                .then(ownerSaved => {
                    req.owner = ownerSaved
                    return  res.json(ownerSaved)
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
}
// const create = async (req, res,) => {
//     try {
//         const owner = new Owner();
//         owner.name = req.body.name
//         owner.about = req.body.about
//         //owner.photo = req.body.photo

//         const reg = await owner.save();

//         return res.status(200)
//             .json(vm.ApiResponse(true, 200, " Nueva dueño creada", reg))
//     } catch (err) {
//         return res.status(500)
//             .json(vm.ApiResponse(false, 500, err.message))
//     }
// };

const index = async (req, res) => {
    const reg = await Owner.find();

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