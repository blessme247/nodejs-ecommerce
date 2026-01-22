import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderItemsSchema = new Schema({
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
    sellerId: {type: Schema.Types.ObjectId, ref: 'User'},
    orderId: {type: Schema.Types.ObjectId, ref: 'Order'},
    statusId: {type: Schema.Types.ObjectId, ref: 'OrderStatus'},
    // item_status (e.g., Preparing, Shipped, Delivered) — allows individual vendors to fulfill their part of a shared order independently. 
});

export default mongoose.model('OrderItems', orderItemsSchema)