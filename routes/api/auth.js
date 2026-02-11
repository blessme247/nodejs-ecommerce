import express from "express"
const router = express.Router();
import handleLogin from "../../controllers/auth.controller.js"
import register from "../../controllers/register.controller.js";
import refreshToken from "../../controllers/refresh.token.controller.js";
import logout from "../../controllers/logout.controller.js";
import { authRateLimiter } from "../../middleware/rateLimiter.js";
import { body } from "express-validator";

router.use(authRateLimiter)

router.post("/login",[
    body("email").trim().isEmail().withMessage("Please enter a valid email address"),
    body("password").trim().notEmpty().withMessage("Password is required")
], handleLogin);

router.post("/signup", [
    body("email").trim().isEmail().withMessage("Please enter a valid email address"),
    body("password").trim().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter"),
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("roleId").trim().notEmpty().withMessage("Role is required")
], register
)


router.route("/refresh").post(refreshToken)

router.route("/logout").post(logout)

export default router;