import env from "dotenv";
env.config();
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname as pathDirname } from 'path';
import logEvents from "./middleware/logEvents.js";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import indexRouter from "./routes/api/index.js";
import corsOptions from "./config/corsOptions.js";
import cookieParser from "cookie-parser";
import credentials from "./middleware/credentials.js";
import mongoose from "mongoose";
import connectDB from "./config/dbConfig.js";
import { loadCart } from "./middleware/loadCart.js";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { csrfSync } from "csrf-sync";
import { useAuth } from "./middleware/useAuth.js";
// import mongoSanitize from "express-mongo-sanitize"
// import helmet from "helmet";
// import { randomBytes } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);
const app = express();
const port = process.env.PORT || 3500;
const { logger } = logEvents;


app.use(logger);
app.set('view engine', 'ejs');
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser()); 
app.use(express.static(path.join(__dirname, "/public")));
app.use('/subdir', express.static(path.join(__dirname, "/public")));

// app.use(helmet({
//       contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
        
//         // ✅ Allow images from Cloudinary
//         imgSrc: [
//           "'self'",
//           "data:",
//           "https://res.cloudinary.com",  // Cloudinary domain
//           "https://*.cloudinary.com"     // Any Cloudinary subdomain
//         ],
//         scriptSrc: [
//           "'self'",
//           (req, res) => `'nonce-${res.locals.nonce}'`  
//         ],
//         styleSrc: [
//           "'self'",
//           (req, res) => `'nonce-${res.locals.nonce}'`, 
//           "https://fonts.googleapis.com"  
//         ],
//         fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
//         connectSrc: ["'self'"],
//         // Forms can only submit to self
//         formAction: ["'self'"],
        
//         // Frames (iframes)
//         frameAncestors: ["'none'"],  // Prevents clickjacking
//     }
// }
// }))

connectDB();



mongoose.connection.once('open', () => {
    console.log('Connected to database:', mongoose.connection.db.databaseName);

    const store = MongoStore.create({
        client: mongoose.connection.getClient(),
        collectionName: 'sessions',
        ttl: 7 * 24 * 60 * 60,
        autoRemove: 'native'
    });

    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store,
        rolling: true,  // Extend session on every request
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
    }));

    const { csrfSynchronisedProtection } = csrfSync({
  getTokenFromRequest: (req) => {
    // If the incoming request is a application/x-www-form-urlencoded content type
    // then get the token from the body.
    if (req.is("application/x-www-form-urlencoded")) {
      return req.body["_csrf"];
    }
    // Otherwise use the header for all other request types
    return req.headers["x-csrf-token"];
  },
});
    
    app.use(csrfSynchronisedProtection);

    app.use((req, res, next) => {
    //   console.log(req.session, 'session')
        res.locals.csrfToken = req.csrfToken();
        // Generate a unique nonce for each request
        // res.locals.nonce = randomBytes(16).toString('base64');
        next();
    });

    // app.use(mongoSanitize())

    app.use(useAuth)
    app.use(loadCart);

    app.use('/', indexRouter);

    app.use((req, res) => {
        res.status(404);
        if (req.accepts("html")) {
            res.sendFile(path.join(__dirname, 'views', '404.html'));
        } else if (req.accepts("json")) {
            res.json({ "error": "404 Not found" });
        } else {
            res.type('txt').send("404 Not found");
        }
    });

    app.use(errorHandler);

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
