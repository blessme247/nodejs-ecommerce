import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import constants from "../utils/constants.js";
import { v2 as cloudinary } from "cloudinary";
const { fileSizeLimit } = constants;
import Asset from "../model/Asset.js";
import User from "../model/User.js";
import utils from "../utils/constants.js"
const {cloudinaryAssestFolderName} = utils

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: fileSizeLimit } }).single(
  "file"
);

const uploadAdapter = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      //   console.error(err, 'multer error ')

      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File size exceeds limit." });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      console.error(err, "unknown error ");
      return res.status(400).json({ message: err.message });
    }
    // Everything went fine.
    next();
  });
};

const uploadToCloud = async (req) => {
  try {
    const result = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "auto", folder: cloudinaryAssestFolderName,  },
          (error, uploadResult) => {
            if (error) {
              // console.log(error, 'error uploading to cloudinary')
              return { success: false, asset: null, error: error.message || "Error uploading file." };
            }
            // console.log(uploadResult, 'uploadResult')
            return resolve(uploadResult);
          }
        )
        .end(req.file.buffer);
    });

    if (result && result.secure_url) {
      const userId = req.userId;
      const foundUser = await User.findById(userId).exec();
      //   console.log(foundUser, "foundUser")
      const asset = new Asset({
        public_id: result.public_id,
        secure_url: result.secure_url,
        asset_id: result.asset_id,
        width: result.width,
        height: result.height,
        format: result.format,
        resource_type: result.resource_type,
        type: result.type,
        bytes: result.bytes,
        folder: result.folder,
        user: foundUser._id ?? "",
      });
      // await asset.save();
      return { asset, error: null}
    }

    // console.log(result, 'cloudinary upload result')
  } catch (error) {
    // console.log(error, 'error in catch block')
    return {  asset: null, error: error.message || "Internal server error" };
  }
};


export default { uploadAdapter, uploadToCloud };
