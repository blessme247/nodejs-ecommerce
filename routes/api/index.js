import express from "express"
import authRouter from "./auth.js"
import usersRouter from "./users.js"
import uploadRouter from "./upload.js"
import assetsRouter from "./assets.js"
import rolesRouter from "./roles.js"
import ordersRouter from "./orders.js"
import productsRouter from "./products.js"
import path from "path"
import { fileURLToPath } from 'url';
import { dirname as pathDirname } from 'path';
import Role from "../../model/Role.js"


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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* GET home page. */
// router.get('/', cache.route(), function(req, res, next) {
//   res.status(httpStatus.OK).json({deployed: true});
// });



const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);
router.get(['/', '/index.html', '/index'], (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'index.html'));
});

// render views 
router.get("/signup", async (req, res)=> {
  console.log(req.accepts(), 'accept heeaders')
  const roles = await Role.find(
        { name: { $not: { $regex: /^admin$/i } } },
        { name: 1, _id: 1 },
      ).exec();
  res.render('auth/signup', {
    pageTitle: "Sign Up",
    path: "auth/signup",
    validationErrors: [],
    errorMessage: "",
    data: roles,
    formValues: {}
  })
})

router.get("/login", (req, res)=> {
  res.render('auth/signin', {
    pageTitle: "Log In",
    path: "auth/signin",
    validationErrors: [],
    errorMessage: "",
    formValues: {}
  })
})

// router.get("/shop/orders", (req, res) => {
//   res.render("shop/orders")
// })

// router.get("/shop/products", (req, res)=> {

// })

export default router;
