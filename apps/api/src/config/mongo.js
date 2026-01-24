import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export async function connectMongo(mongoUrl) {
    mongoose.set("strictQuery", true); //dto validationpipe mantığı 

    await mongoose.connect(mongoUrl);

    logger.info("mongo connected");
    return mongoose.connection;
} export async function disconnectMongo() {
    await mongoose.disconnect();
    logger.info("mongo disconnected");
}
