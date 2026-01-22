import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cartDetailsSchema = new Schema({
   name: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    productId: {type: Schema.Types.ObjectId, ref: 'Product'},
});

const cartSchema = new Schema({
    buyerId: {type: Schema.Types.ObjectId, ref: 'User'},
    cartDetails: [cartDetailsSchema]
    
})

export default mongoose.model('Cart', cartSchema)