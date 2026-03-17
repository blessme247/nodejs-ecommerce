import mongoose from "mongoose";
const Schema = mongoose.Schema;



const buyerSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    phoneNumber: {
        type: String,
        // required: true
    },
      email: {
        type: String,
        required: true
    },
     shippingAddress: {
        type: String
    },
     paymentInfo: {
        type: String
    },
    
})

export default mongoose.model('Buyer', buyerSchema)