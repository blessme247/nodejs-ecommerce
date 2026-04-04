import express from "express";
const router = express.Router();
import { getCheckoutPage } from "../../controllers/checkout.controller.js";



router
  .route("/")
  .get(getCheckoutPage)

export default router;
