import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    roleId: {type: Schema.Types.ObjectId, ref: 'Role'},
    password: {
        type: String,
        required: true
    },
    refreshToken:  String
})

export default mongoose.model('User', userSchema)