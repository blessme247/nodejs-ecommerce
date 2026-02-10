import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    roleId: {type: Schema.Types.ObjectId, ref: 'Role'},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {
        type: String,
        required: true,
        minlength: 8,
        uppercase: true,
        lowercase: true
    },
    refreshToken:  String
})

export default mongoose.model('User', userSchema)