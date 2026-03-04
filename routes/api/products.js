import express from "express";
const router = express.Router();
import { getProducts, getProductsBySellerId, updateProduct, addProduct, getSellerProductsPage, getProductManagementPage } from "../../controllers/products.controller.js";
import verifyRoles from "../../middleware/verifyRoles.js";
import verifyJwt from "../../middleware/verifyJwt.js";
import { roles } from "../../config/seedData.js";
import { body } from "express-validator";
import {uploadAdapter} from "../../services/uploadToCloud.js"
import { allowedImageFormats } from "../../utils/constants.js";
// const roleValues = Object.values(roles)
const adminRole = roles.find(r => r.name === 'Admin')
const sellerRole = roles.find(r => r.name === 'Seller')
router.use(verifyJwt)

router
  .route("/")
  .get(getProducts)
  .post(verifyRoles(adminRole.code, sellerRole.code), uploadAdapter, [ //multer extracts all the request text files in multipart/formdata and ejects them into req.body
      body("name").trim().notEmpty().withMessage("Product name is required"),
      body("price").trim().notEmpty().isNumeric().withMessage("Price is required"),
      body("description").trim().notEmpty().withMessage("Description is required"),
      body("categoryId").trim().notEmpty().withMessage("Category is required"),
      body("quantityAvailable").trim().notEmpty().isNumeric().withMessage("Quantity is required"),
      body("file").custom((value, { req } ) => {
         if (!req.file) {
      throw new Error('Product image is required');
    }
    // Check file type (example: only JPEG or PNG allowed)
    if (!allowedImageFormats.includes(req.file.mimetype)) {
      throw new Error('Only JPG, PNG, and WEBP images are allowed');
    }
    // Check file size (example: max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (req.file.size > maxSize) {
      throw new Error('File size exceeds 2MB limit');
    }
    // Return a truthy value to indicate success
    return true;
      }).withMessage("Product image is required"),
  ], addProduct);

router.route("/seller").get(verifyRoles(sellerRole.code), getSellerProductsPage)
router.route("/add").get(verifyRoles(sellerRole.code), getProductManagementPage)
router.route("/edit/:productId").get(verifyRoles(sellerRole.code), getProductManagementPage)

router
  .route("/:id")
  .get(verifyRoles(adminRole.code, sellerRole.code), getProductsBySellerId)
  .post(verifyRoles(adminRole.code, sellerRole.code), updateProduct);

export default router;
