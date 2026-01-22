import mongoose from "mongoose";
const Schema = mongoose.Schema;

const eagerSchema = new Schema({
  status: String,
  batch_id: String,
  url: String,
  secure_url: String
});

const assetSchema = new Schema({
    public_id: {
        type: String,
        required: true
    },
     asset_id: {
        type: String,
        required: true
    },
      secure_url: {
        type: String,
        required: true
    },
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    width: {
        type: Number
    },
    height: {
        type: Number
    },
    format: {
        type: String
    },
    resource_type: {
        type: String
    },
    type: {
        type: String
    },
     bytes: {
        type: Number
    },
    folder: {
        type: String
    },
    eager: [eagerSchema]
})

export default mongoose.model('Asset', assetSchema)
