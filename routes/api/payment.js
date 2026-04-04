import express from "express";
const router = express.Router();
import { initiatePayment, verifyPayment } from "../../controllers/payments.controller.js";
import { body } from "express-validator";
import verifyJwt from "../../middleware/verifyJwt.js";


// router.use(verifyJwt)
router
  .route("/initiate")
  .post(
    verifyJwt,
    [body("amount").trim().notEmpty().isNumeric().withMessage("amount is required")],
    initiatePayment)

    router.route("/callback").get(verifyPayment)

export default router;
