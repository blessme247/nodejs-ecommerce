import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productCategoriesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
     code: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

export default mongoose.model('ProductCategory', productCategoriesSchema)