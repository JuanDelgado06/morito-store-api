const Review = require('../models/review');
const Product = require('../models/product');
const vm = require('v-response');

const create = async (req, res) => {
    try {
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
const update = async (req, res) => {
    try {
        const upReview = req.body;
        const review = await Review.findOne({_id : req.params.reviewId});
        //Comprobar si existe
        if(!review) return res.status(404).json(vm.ApiResponse(false, 404, "Review ni encontrado"));
        //Comprobar si es el dueño del comentario
        if(review.user._id.toString() !== req.user.id) return res.status(400).json(vm.ApiResponse(false, 400, "No tienes permiso para modificar este comentario"));
        //Actualizar review
        if(review) {
            if (upReview.headline) review.headline = upReview.headline;
            if (upReview.body) review.body = upReview.body;
            if (upReview.rating) review.rating = upReview.rating;

            await review.save();
            return res.status(200)
                .json(vm.ApiResponse(true, 200, "Perfil actualizado", review));
        }    
    } catch (e) {
        console.log("err :", e);
        return res.status(400)
            .json(vm.ApiResponse(false, 400, "Ocurrio un error", e))
    }
}
const destroy = async (req, res) => {
    try {
        const review = await Review.findOne({_id : req.params.reviewId});
        if(review.user.toString() !== req.user.id) return res.status(400).json(vm.ApiResponse(false, 400, "No tienes permiso para eliminar este comentario"));
        
        await Product.updateOne( 
            {_id: review.productId}, 
            { $pull: { reviews: review._id } }
        ); 
        await Review.findOneAndRemove({_id : req.params.reviewId});
        return res.status(200)
            .json(vm.ApiResponse(true, 200, "Comentario eliminado"));
    } catch (e) {
        console.log("err :", e);
        return res.status(400)
            .json(vm.ApiResponse(false, 400, "Ocurrio un error", e));
    }

}
module.exports = {
    create,
    index,
    update,
    destroy
}