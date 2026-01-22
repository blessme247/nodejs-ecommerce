import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderStatusSchema = new Schema({
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
    },
})

export default mongoose.model('OrderStatus', orderStatusSchema)