// handle file upload using multer without saving the file to a folder in the codebase and uploading to clodinary
// import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import { fileSizeLimit , cloudinaryAssestFolderName} from "../utils/constants.js";
import { v2 as cloudinary } from "cloudinary";
// const { fileSizeLimit } = constants;
import Asset from "../model/Asset.js";
import User from "../model/User.js";

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

const handleUpload = async (req, res) => {
  try {
    const result = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "auto", folder: cloudinaryAssestFolderName,  },
          (error, uploadResult) => {
            if (error) {
              // console.log(error, 'error uploading to cloudinary')
              return res
                .status(400)
                .json({ message: "Error uploading file.", error });
            }
            // console.log(uploadResult, 'uploadResult')
            return resolve(uploadResult);
          }
        )
        .end(req.file.buffer);
    });

    if (result && result.secure_url) {
      const username = req.user;
      const foundUser = await User.findOne({ username }).exec();
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
      await asset.save();
      return res
        .status(201)
        .json({ message: "File uploaded successfully.", data: result });
    }

    // console.log(result, 'cloudinary upload result')
  } catch (error) {
    // console.log(error, 'error in catch block')
    return res
      .status(400)
      .json({ message: "Error uploading file.", error: error.message });
  }
};


export default { uploadAdapter, handleUpload };

// {
//   fieldname: 'file',
//   originalname: 'Abraham Solabi resume .pdf',
//   encoding: '7bit',
//   mimetype: 'application/pdf',
//   destination: 'uploads/',
//   filename: '1767342835504-Abraham Solabi resume .pdf',
//   path: 'uploads/1767342835504-Abraham Solabi resume .pdf',
//   size: 165507
// } file object
