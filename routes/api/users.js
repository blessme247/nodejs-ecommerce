import express from "express";
const router = express.Router();
import usersController from "../../controllers/users.controller.js";
const { getAllUsers, getSingleUser } = usersController;
import roles from "../../config/rolesList.js";
import verifyRoles from "../../middleware/verifyRoles.js";
import verifyJwt from "../../middleware/verifyJwt.js";


router.use(verifyJwt)

router.route("/").get(verifyRoles(roles.Admin, roles.Editor), getAllUsers);

router.route("/:id").get(verifyRoles(roles.Admin), getSingleUser);

export default router;
