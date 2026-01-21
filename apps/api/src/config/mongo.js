import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export async function connectMongo(mongoUrl) {
    mongoose.set("strictQuery", true); //dto mantığı 

    await mongoose.connect(mongoUrl);

    logger.info("mongo connected");
    return mongoose.connection;
}
