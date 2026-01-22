import mongoose from "mongoose";
import User from "../model/User.js";
import Asset from "../model/Asset.js";
import { v2 as cloudinary } from "cloudinary";
import utils from "../utils/constants.js"
const {cloudinaryAssestFolderName } = utils

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllAssets = async (req, res) => {
  const assets = await Asset.find().exec();
  if (!assets) return res.status(204).json({ message: "No assets found." });
  return res.status(200).json({ data: assets });
};

const getSingleUserAssets = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id parameter is required" });
    }
    const user = await User.findById(id).exec();
    // console.log(user, 'userr')
    if (!user)
      return res.status(404).json({ message: `User with ${id} not found` });

    const assets = await Asset.find({ user: user._id }).exec();
    return res.status(200).json(assets);
  } catch (error) {
    // console.log(error, 'error in catch block')
    // console.log(error.reason, 'error reson in catch block')
    if (error instanceof mongoose.Error) {
      if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid user id" });
      }
      // return res.status(400).json({"message": error?.reason})
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

const handleTransformImage = async (req, res) => {
  const { publicId } = req.query;
  const { transformation } = req.body;
  try {
    if (!publicId)
      return res
        .status(400)
        .json({ message: "publicId is required" });

    const foundImage = await Asset.findOne({ public_id: publicId }).exec();
    if (!foundImage) {
      return res.status(404).json({
        message: `Image with ${publicId} id not found`,
      });
    }

    if (!transformation.length || transformation.length == 0) {
      return res.status(400).json({ message: "invalid request body" });
    }

    const result = await new Promise((resolve) => {
      cloudinary.uploader.explicit(
        foundImage.public_id,
        {
          type: "upload",
          resource_type: "image",
          // media_metadata: true,
          folder: cloudinaryAssestFolderName,
          eager_async: true,
          eager: [
            {
              transformation
            },
          ]
        
        },
        (error, uploadResult) => {
          if (error) {
            console.log(error, "error transforming image");
            return res.status(400).json({ message: "Error transforming image" });
          }
          return resolve(uploadResult);
        }
      );
    });

    if (result && result.public_id) {
      const username = req.user;
      // const foundUser = await User.findOne({ username }).exec();
      const asset = {
              // public_id: result.public_id,
              // secure_url: result.secure_url,
              // asset_id: result.asset_id,
              // width: result.width,
              // height: result.height,
              // format: result.format,
              // resource_type: result.resource_type,
              // type: result.type,
              // bytes: result.bytes,
              // folder: result.folder,
              eager: result.eager,
              // user: foundUser._id ?? ""
            }

      await Asset.updateOne({public_id: foundImage.public_id}, asset)

      // console.log(result, "result");
      return res.status(200).json({ message: "Image transformed successfully.", data: result });
    }
  } catch (error) {
    // console.log(error, "catch block error");
    if (error instanceof mongoose.Error) {
      if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid public id" });
      }
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

export default {
  getAllAssets,
  getSingleUserAssets,
  handleTransformImage,
};
