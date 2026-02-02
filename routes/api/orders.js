import express from "express";
const router = express.Router();
import { getAllSellerOrders, makeOrder, updateOrderStatus } from "../../controllers/orders.controller.js";
import verifyRoles from "../../middleware/verifyRoles.js";
import verifyJwt from "../../middleware/verifyJwt.js";
import { roles } from "../../config/seedData.js";

// const roleValues = Object.values(roles)
const adminRole = roles.find(r => r.name === 'Admin')
const sellerRole = roles.find(r => r.name === 'Seller')
const buyerRole = roles.find(r => r.name === "Buyer")

router.use(verifyJwt)

router
  .route("/")
  .get(verifyRoles(adminRole.code, sellerRole.code), getAllSellerOrders)
  .post(verifyRoles(adminRole.code, buyerRole.code), makeOrder);

router
  .route("/:id")
  .post(verifyRoles(adminRole.code, sellerRole.code), updateOrderStatus);

export default router;
