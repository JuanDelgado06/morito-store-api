const Product = require('../models/product');
const vm = require('v-response');

module.exports = async (req, res, next) => {
    try {
        const product = await Product.findOne({_id : req.params.productId})
            .select("reviews")
            .populate("reviews", "user")
            .exec();
        if(product) {
            const reviews = product.reviews;           
            const userId = req.user.id;
            const search = () => reviews.filter((rev) => rev.user == userId );
    
            const searchUser = search();
            console.log(searchUser.length);
            if (searchUser.length === 0) {
                console.log('Puedes crear tu primer comentario');
                next();
            } else {
                res.status(400)
                    .json(vm.ApiResponse(false, 400, "No puedes crear mas de un comentario"))
                next(new Error("No puedes crear mas de un comentario"));
            }
        }
    } catch (e) {
        return res.status(400)
            .json(vm.ApiResponse(false, 400, "Ocurrio un error", e))
    }
}