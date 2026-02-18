import mongoose from "mongoose";
import { seedCategories, seedRoles, seedStatuses } from "./seedData.js";
import os from "os"
import dns from 'node:dns/promises';

const osPlatform = os.platform()

const connectDB = async ()=> {
    if(osPlatform == "win32"){
        dns.setServers(["8.8.8.8", "1.1.1.1"]); 
    }
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            // useUnifiedTopology: true,
            // useNewUrlParser: true
        })

        await seedStatuses()
        await seedRoles()
        await seedCategories()
        
    } catch (error) {
        console.error(error, "DB connection error")
    }
}

export default connectDB