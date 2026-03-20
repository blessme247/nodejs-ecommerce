import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cartItemsSchema = new Schema({
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true}
});

const cartSchema = new Schema({
    buyerId: {type: Schema.Types.ObjectId, ref: 'User'},
    cartItems: {type: [cartItemsSchema], default: []},
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    sessionId: { type: String },
    expiresAt: { type: Date },
},
{timestamps: true}
)

// delete document from DB immediately they expire
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Cart', cartSchema)