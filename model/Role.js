import mongoose from "mongoose";
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true
    }
})

export default mongoose.model('Role', roleSchema)