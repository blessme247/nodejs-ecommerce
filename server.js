import env from "dotenv"
env.config()
import express from "express";
// import fs from "fs";
import path from "path"
import { fileURLToPath } from 'url';
import { dirname as pathDirname } from 'path';
import logEvents from "./middleware/logEvents.js";
import cors from "cors"
import errorHandler from "./middleware/errorHandler.js";
import indexRouter from "./routes/api/index.js"
// import subdirRouter from "./routes/subdir.js"
import corsOptions from "./config/corsOptions.js";
import cookieParser from "cookie-parser"
import credentials from "./middleware/credentials.js";
import mongoose from "mongoose"
import connectDB from "./config/dbConfig.js";
import optionalAuth from "./middleware/optionalAuth.js";
import { loadCart } from "./middleware/loadCart.js";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { csrfSync } from "csrf-sync";


const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);
const app = express()
const port = process.env.PORT || 3500;
const {logger} = logEvents

const store = MongoStore.create({
    mongoUrl: process.env.DATABASE_URI,
    collectionName: 'sessions',
    ttl: 7 * 24 * 60 * 60,
    
  })

  const {
  invalidCsrfTokenError, // This is just for convenience if you plan on making your own middleware.
  generateToken, // Use this in your routes to generate, store, and get a CSRF token.
  getTokenFromRequest, // use this to retrieve the token submitted by a user
  getTokenFromState, // The default method for retrieving a token from state.
  storeTokenInState, // The default method for storing a token in state.
  revokeToken, // Revokes/deletes a token by calling storeTokenInState(undefined)
  csrfSynchronisedProtection, // This is the default CSRF protection middleware.
} = csrfSync();

connectDB()

app.use(logger)

app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// Handle options credentials check - before CORS!
app.use(credentials)

app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
app.use(express.urlencoded({extended: false}))

// middleware for json
app.use(express.json())

// middleware for session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Only create when cart is used
    store,
     cookie: {
    // secure: process.env.NODE_ENV === 'production',
    // httpOnly: true,
    sameSite: 'strict',
    // maxAge: 7 * 24 * 60 * 60 * 1000
  }
}))

app.use(csrfSynchronisedProtection);
// Anything registered after this will be considered "protected"

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// middleware for cookies
app.use(cookieParser())

app.use(optionalAuth)
app.use(loadCart)

app.use(express.static(path.join(__dirname, "/public")))
app.use('/subdir', express.static(path.join(__dirname, "/public")))

app.use('/', indexRouter)


// 404 catch-all route 
app.use((req, res) => {
  res.status(404)
    if(req.accepts("html")){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }else if(req.accepts("json")){
        res.json({"error": "404 Not found"})
    }else {
        res.type('txt').send( "404 Not found")
    }
});


app.use(errorHandler)

mongoose.connection.once('open', ()=> {
    console.log('Connected to database:', mongoose.connection.db.databaseName);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
})
