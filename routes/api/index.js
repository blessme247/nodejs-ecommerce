import express from "express"
import authRouter from "./auth.js"
import employeesRouter from "./employees.js"
import usersRouter from "./users.js"
import uploadRouter from "./upload.js"
import assetsRouter from "./assets.js"
import rolesRouter from "./roles.js"
import path from "path"
import { fileURLToPath } from 'url';
import { dirname as pathDirname } from 'path';
// const httpStatus = require('http-status');
// const cache = require('../../utils/cache');


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

router.get(['/new-page', 'new-page.html'], (req, res)=> {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'new-page.html'))
})

router.get(['/old-page', 'old-page.html'], (req, res)=> {
    res.redirect(301, 'new-page.html') // 302 by default
})

export default router;
