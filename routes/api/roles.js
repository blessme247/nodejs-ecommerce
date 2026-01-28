import express from "express";
const router = express.Router();
import { getRoles } from "../../controllers/roles.controller.js";



router
  .route("/")
  .get(getRoles)


export default router;
