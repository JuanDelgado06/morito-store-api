const Review = require('../models/review');
const Product = require('../models/product');
const _ = require('underscore')
const fs = require('fs')
const upload = require('../helpers/helper').upload;
const vm = require('v-response');

const create = async (req, res) => {
    const files = req.files;
    try {
        if (!req.files || _.isEmpty(req.files) ) {
            let body = req.body;
            body.user = req.user.id;
            body.productId = req.params.productId;
            const review = new Review(body);

            await Product.updateOne( {_id: req.params.productId}, { $push: { reviews : review._id} } ); 
            const reviewSave = await review.save();
    
            if (reviewSave) {
                return res.status(200)
                    .json(vm.ApiResponse(true, 200, " Nueva reseña creada", reviewSave))
            }
        }
        //Si envia imagenes
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
            body.user = req.user.id;
            body.productId = req.params.productId;
            const bodyw = _.extend(body, {photo_review: urls});
            const review = new Review(bodyw);

            await Product.updateOne( {_id: req.params.productId}, { $push: { reviews : review._id} } ); 
            const reviewSave = await review.save();
            if (reviewSave) {
                return res.status(200)
                    .json(vm.ApiResponse(true, 200, " Nueva reseña creada", reviewSave))
            }
        }    
    } catch (e) {
        console.log("err :", e);
        return res.status(400)
                .json(vm.ApiResponse(false, 400, "Ocurrio un error", e))
    }
}
const index = async (req, res) => {
    try {
        const producReviews = await Review.find({
            productId : req.params.productId
        }).populate("user", "name email").exec();
        return res.status(200)
            .json(vm.ApiResponse(true, 200, "", producReviews))
    } catch (e) {
        console.log("err :", e);
        return res.status(400)
                .json(vm.ApiResponse(false, 400, "Ocurrio un error", e))
    }
}
module.exports = {
    create,
    index,
}