import mongoose from "mongoose";
import { jest } from "@jest/globals";
import { getRedisClient } from "../config/redis.js";
import { connectRabbit, closeRabbit } from "../config/rabbit.js";

// Import all models to register schemas
await import("../modules/users/repository.js");
await import("../modules/projects/repository.js");
await import("../modules/tasks/repository.js");
await import("../modules/auth/repository.js");

// IMPORTANT: Always use separate test database to prevent production data loss!
// Never use MONGO_URL from environment for tests
const MONGO_HOST = process.env.MONGO_HOST || "mongo";
const TEST_MONGO_URL = `mongodb://${MONGO_HOST}:27017/taskboard_test`;
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

        // Redis may not be initialized in tests, handle gracefully
        try {
            const redis = getRedisClient();
            if (redis) await redis.quit();
        } catch {
            // Redis not initialized, ignore
        }

        // Close RabbitMQ connection
        await closeRabbit();
        rabbitConnection = null;
    } catch (e) {
        console.error("Teardown Error:", e.message);
    }
}
