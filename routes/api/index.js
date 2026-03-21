import express from "express"
import authRouter from "./auth.js"
import usersRouter from "./users.js"
import uploadRouter from "./upload.js"
import assetsRouter from "./assets.js"
import rolesRouter from "./roles.js"
import ordersRouter from "./orders.js"
import productsRouter from "./products.js"
import cartRouter from "./cart.js"
// import path from "path"
// import { fileURLToPath } from 'url';
// import { dirname as pathDirname } from 'path';
import { getLoginPage, getSignupPage } from "../../controllers/auth.controller.js"
import { getHomepage } from "../../controllers/views.controller.js"


const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRouter,
  },
  {
    path: '/roles',
    route: rolesRouter,
  },
  {
    path: '/users',
    route: usersRouter,
  },
   {
    path: '/orders',
    route: ordersRouter,
  },
   {
    path: '/products',
    route: productsRouter,
  },
  {
    path: '/upload',
    route: uploadRouter,
  },
   {
    path: '/assets',
    route: assetsRouter,
  },
  {
    path: '/cart',
    route: cartRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* GET home page. */
// router.get('/', cache.route(), function(req, res, next) {
//   res.status(httpStatus.OK).json({deployed: true});
// });



// const __filename = fileURLToPath(import.meta.url);
// const __dirname = pathDirname(__filename);
// router.get(['/', '/index.html', '/index'], (req, res) => {
//     res.sendFile(path.join(__dirname, '..', '..', 'views', 'index.html'));
// });

router.get(['/', '/index.html', '/index'], getHomepage)

// render views 
router.get("/signup", getSignupPage)

router.get("/login", getLoginPage)

// router.get("/shop/orders", (req, res) => {
//   res.render("shop/orders")
// })

// router.get("/shop/products", (req, res)=> {

// })

export default router;
