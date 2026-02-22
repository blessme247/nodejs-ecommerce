import express from "express";
const router = express.Router();
import { getProducts, getProductsBySellerId, updateProduct, addProduct, getSellerProductsPage, getProductManagementPage } from "../../controllers/products.controller.js";
import verifyRoles from "../../middleware/verifyRoles.js";
import verifyJwt from "../../middleware/verifyJwt.js";
import { roles } from "../../config/seedData.js";
import { body } from "express-validator";

// const roleValues = Object.values(roles)
const adminRole = roles.find(r => r.name === 'Admin')
const sellerRole = roles.find(r => r.name === 'Seller')
router.use(verifyJwt)

router
  .route("/")
  .get(getProducts)
  .post(verifyRoles(adminRole.code, sellerRole.code), [
      body("name").trim().notEmpty().withMessage("Product name is required"),
      body("price").trim().notEmpty().withMessage("Last name is required"),
      body("desscription").trim().notEmpty().withMessage("Role is required"),
      body("categoryId").trim().notEmpty().withMessage("Role is required"),
      body("quantityAvailable").trim().notEmpty().withMessage("Role is required"),
      body("file").trim().notEmpty().withMessage("Role is required"),
  ], addProduct);

router.route("/seller").get(verifyRoles(sellerRole.code), getSellerProductsPage)
router.route("/manage").get(verifyRoles(sellerRole.code), getProductManagementPage)
router.route("/manage/:productId").get(verifyRoles(sellerRole.code), getProductManagementPage)

router
  .route("/:id")
  .get(verifyRoles(adminRole.code, sellerRole.code), getProductsBySellerId)
  .post(verifyRoles(adminRole.code, sellerRole.code), updateProduct);

export default router;
