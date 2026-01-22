import express from "express"
const router = express.Router();
import handleLogin from "../../controllers/auth.controller.js"
import register from "../../controllers/register.controller.js";
import refreshToken from "../../controllers/refresh.token.controller.js";
import logout from "../../controllers/logout.controller.js";
import { authRateLimiter } from "../../middleware/rateLimiter.js";

router.use(authRateLimiter)
// router.post('/', handleLogin);
router.route("/login").post(handleLogin);
router.route("/register").post(register)
router.route("/refresh").post(refreshToken)
router.route("/logout").post(logout)

export default router;