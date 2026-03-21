import express from "express";
const router = express.Router();
import { addProductToCart, getCartPage } from "../../controllers/cart.controller.js";
import { body } from "express-validator";



router
  .route("/")
  .get(getCartPage)
  .post([body("productId").trim().notEmpty().isString().withMessage("Product id is required")], addProductToCart)


export default router;
