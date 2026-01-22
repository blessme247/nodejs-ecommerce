import multer from "multer";
import constants from "../utils/constants.js";
import fs from "fs";
import { v2 as cloudinary} from "cloudinary"
const { fileSizeLimit } = constants;


if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,  "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname, );
    }
});
// const uploadAdapter = multer({ storage, limits: { fileSize: fileSizeLimit } }).single("file");

const uploadAdapter = (req, res, next)=> {
  const upload = multer({ storage, limits: { fileSize: fileSizeLimit }}).single("file")
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.error(err, 'multer error ')

      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File size exceeds limit." });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      console.error(err, 'unknown error ')
      return res.status(400).json({ message: err.message });
    }
    // Everything went fine.
    next();
  });
}

const handleUpload = async (req, res) => {
  // console.log(req, 'request object')
  console.log(req.file, 'file object')
  try {
    // const result = await cloudinary.uploader.upload(req.file.path, {
    //   folder: "uploads",
    //   resource_type: "auto"
    // });
    return res.status(200).json({ message: "File uploaded successfully.", file: req.file });

  } catch (error) {
    return res.status(400).json({ message: "Error uploading file.", error });
  }
};


export default {uploadAdapter, handleUpload};