import express from "express";
const router = express.Router();
import { addProductToCart, getCartPage, updateCartItemQuantity } from "../../controllers/cart.controller.js";
import { body } from "express-validator";



router
  .route("/")
  .get(getCartPage)
  .post([body("productId").trim().notEmpty().isString().withMessage("Product id is required")], addProductToCart)

  router.route("/update")
  .patch([body("quantity").trim().notEmpty().isNumeric().withMessage("Quantity is required"),
    body("productId").trim().notEmpty().isString().withMessage("Product id is required")
  ], updateCartItemQuantity)


export default router;
