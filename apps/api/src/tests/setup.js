import mongoose from "mongoose";
import { jest } from "@jest/globals";
import { getRedisClient } from "../config/redis.js";
import { connectRabbit } from "../config/rabbit.js";

// Import all models to register schemas
await import("../modules/users/repository.js");
await import("../modules/projects/repository.js");
await import("../modules/tasks/repository.js");
await import("../modules/auth/repository.js");

// Use environment variables (will be set by Docker)
const TEST_MONGO_URL = process.env.MONGO_URL || "mongodb://mongo:27017/taskboard_test";
const TEST_RABBIT_URL = process.env.RABBIT_URL || "amqp://rabbitmq:5672";

jest.setTimeout(60000);

// Store RabbitMQ connection reference for cleanup
let rabbitConnection = null;

export async function connectTestDb() {
    try {
        // Connect to MongoDB if not already connected
        if (mongoose.connection.readyState === 0) {
            console.log("Connecting to Test DB:", TEST_MONGO_URL);
            await mongoose.connect(TEST_MONGO_URL, {
                serverSelectionTimeoutMS: 10000,
            });
            console.log("Connected to MongoDB");
        }

        // Always connect RabbitMQ (even if MongoDB was already connected)
        if (!rabbitConnection) {
            console.log("Connecting to RabbitMQ:", TEST_RABBIT_URL);
            rabbitConnection = await connectRabbit(TEST_RABBIT_URL);
            console.log("Connected to RabbitMQ", rabbitConnection);
        }
    } catch (err) {
        console.error("Test Setup Failed:", err.message);
        throw err;
    }
}

export async function closeTestDb() {
    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
        }

        const redis = getRedisClient();
        if (redis) await redis.quit();

        // Close RabbitMQ connection
        if (rabbitConnection) {
            try {
                await rabbitConnection.channel?.close();
                await rabbitConnection.conn?.close();
                console.log("RabbitMQ connection closed");
            } catch (e) {
                console.error("RabbitMQ close error:", e.message);
            }
        }
    } catch (e) {
        console.error("Teardown Error:", e.message);
    }
}
