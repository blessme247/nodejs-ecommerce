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
const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);
const app = express()
const port = process.env.PORT || 3500;
const {logger} = logEvents

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
