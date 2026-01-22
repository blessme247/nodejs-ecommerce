import express from "express";
const router = express.Router();
import assetsController from "../../controllers/assets.controller.js";
const { getAllAssets, getSingleUserAssets, handleTransformImage } = assetsController;
import roles from "../../config/rolesList.js";
import verifyRoles from "../../middleware/verifyRoles.js";
import verifyJwt from "../../middleware/verifyJwt.js";
import { globalRateLimiter } from "../../middleware/rateLimiter.js";


router.use(verifyJwt)

router.route("/").get(getAllAssets);

router.route("/:id").get(getSingleUserAssets);

router.route("/transform").put(globalRateLimiter, verifyRoles(roles.Admin, roles.User), handleTransformImage);

export default router;
