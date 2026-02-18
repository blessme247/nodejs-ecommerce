import express from "express";
const router = express.Router();
import { getProducts, getProductsBySellerId, updateProduct, addProduct, getSellerProductsPage } from "../../controllers/products.controller.js";
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
  .get(getProducts)
  .post(verifyRoles(adminRole.code, sellerRole.code), addProduct);

router.route("/seller").get(verifyRoles(sellerRole.code), getSellerProductsPage)

router
  .route("/:id")
  .get(verifyRoles(adminRole.code, sellerRole.code), getProductsBySellerId)
  .post(verifyRoles(adminRole.code, sellerRole.code), updateProduct);

export default router;
