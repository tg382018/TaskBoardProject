import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export async function connectMongo(mongoUrl) {
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongoUrl);
    logger.info("mongo connected");
    return mongoose.connection;
}
