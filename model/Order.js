import mongoose from "mongoose";
import { orderItemsSchema } from "./OrderItem.js";
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    buyerId: {type: Schema.Types.ObjectId, ref: 'User'},
    totalAmount: {
        type: Number,
        required: true
    },
    // statusId: {type: Schema.Types.ObjectId, ref: 'OrderStatus'},
    // items: {type: [orderItemsSchema], default: []},
},
{
    timestamps: true
}
)

export default mongoose.model('Order', orderSchema)