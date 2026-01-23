import { connectMongo, disconnectMongo } from "../src/config/mongo.js";
import { connectRedis } from "../src/config/redis.js";
import { config } from "../src/config/env.js";
import mongoose from "mongoose";

beforeAll(async () => {
    // Use a separate test database
    const testMongoUrl = config.mongoUrl.includes("?")
        ? config.mongoUrl.replace(/\/[^?]+/, "/taskboard_test")
        : `${config.mongoUrl}_test`;

    await connectMongo(testMongoUrl);
    connectRedis(config.redisUrl);
});

afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
    await disconnectMongo();
});
