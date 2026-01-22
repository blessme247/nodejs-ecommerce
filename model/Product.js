import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantityAvailable: {
        type: Number,
        required: true
    },
    inStock: {
        type: Boolean,
        default: true
    },
    sellerId: {type: Schema.Types.ObjectId, ref: 'User'},
    categoryId: {type: Schema.Types.ObjectId, ref: 'ProductCategory'},
})

export default mongoose.model('Product', productSchema)