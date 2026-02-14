import express from "express";
const router = express.Router();
import usersController from "../../controllers/users.controller.js";
const { getAllUsers, getSingleUser } = usersController;
import {ROLE_CODES} from "../../config/rolesList.js";
import verifyRoles from "../../middleware/verifyRoles.js";
import verifyJwt from "../../middleware/verifyJwt.js";


router.use(verifyJwt)

router.route("/").get(verifyRoles(ROLE_CODES.Admin), getAllUsers);

router.route("/:id").get(verifyRoles(ROLE_CODES.Admin), getSingleUser);

export default router;
