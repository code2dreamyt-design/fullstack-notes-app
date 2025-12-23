import mongoose from "mongoose";
import dotenv from"dotenv";
import { URI } from "./env.js";
dotenv.config();

export const connectDB = async ()=>{
    try {
        await mongoose.connect(URI);
        console.log("DB is Connected")
    } catch (error) {
        console.log("COnnection error")
    }
}