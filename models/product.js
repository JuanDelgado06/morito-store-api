const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    owner: { type: Schema.Types.ObjectId, ref: 'Owner' },
    title: String,
    description: String,
    photo_products: {
        type: []
    },
    price: Number,
    stockQuantity: Number,
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
    }, 
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);

ProductSchema.virtual('averageRating').get(function () {
    if (this.reviews.length > 0) {
        let total = [];
        const review = this.reviews;
        for (const rev of review) {
            total.push(rev.rating);
        }
        // console.log(total);
        const sum = total.reduce((a, b) => a + b);
        return sum / this.reviews.length;
    }
    return 0;
})

module.exports = mongoose.model("Product", ProductSchema);