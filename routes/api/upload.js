import express from "express";
const router = express.Router();
import uploadController from "../../controllers/upload.cloudinary.controller.js";
import {ROLE_CODES} from "../../config/rolesList.js";
import verifyRoles from "../../middleware/verifyRoles.js";
import verifyJwt from "../../middleware/verifyJwt.js";

const { uploadAdapter, handleUpload} = uploadController


router.use(verifyJwt)

router.route("/").post(verifyRoles(ROLE_CODES.Admin, ROLE_CODES.Seller), uploadAdapter, handleUpload);

export default router;
