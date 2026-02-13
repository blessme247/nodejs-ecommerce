import express from "express";
const router = express.Router();
import { getAllSellerOrders, makeOrder, updateOrderStatus } from "../../controllers/orders.controller.js";
import verifyRoles from "../../middleware/verifyRoles.js";
import verifyJwt from "../../middleware/verifyJwt.js";
// import { roles } from "../../config/seedData.js";
import { ROLE_CODES } from "../../config/rolesList.js";

// const roleValues = Object.values(roles)

router.use(verifyJwt)

router
  .route("/")
  .get(verifyRoles(ROLE_CODES.Admin, ROLE_CODES.Seller), getAllSellerOrders)
  .post(verifyRoles(ROLE_CODES.Admin, ROLE_CODES.Buyer), makeOrder);

router
  .route("/:id")
  .post(verifyRoles(ROLE_CODES.Admin, ROLE_CODES.Seller), updateOrderStatus);

export default router;
