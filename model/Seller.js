import mongoose from "mongoose";
const Schema = mongoose.Schema;



const sellerSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    phoneNumber: {
        type: String,
        required: true
    },
      email: {
        type: String,
        required: true
    },
    
})

export default mongoose.model('seller', sellerSchema)