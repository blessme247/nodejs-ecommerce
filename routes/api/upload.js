import express from "express";
const router = express.Router();
import uploadController from "../../controllers/upload.cloudinary.controller.js";
import roles from "../../config/rolesList.js";
import verifyRoles from "../../middleware/verifyRoles.js";
import verifyJwt from "../../middleware/verifyJwt.js";

const { uploadAdapter, handleUpload} = uploadController


router.use(verifyJwt)

router.route("/").post(verifyRoles(roles.Admin, roles.Editor), uploadAdapter, handleUpload);

export default router;
