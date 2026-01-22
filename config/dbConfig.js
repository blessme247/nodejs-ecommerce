import mongoose from "mongoose";
import { seedStatuses } from "./seedData.js";

const connectDB = async ()=> {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            // useUnifiedTopology: true,
            // useNewUrlParser: true
        })

        await seedStatuses()
        
    } catch (error) {
        console.error(error, "DB connection error")
    }
}

export default connectDB