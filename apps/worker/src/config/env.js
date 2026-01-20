import dotenv from "dotenv";

dotenv.config();

export const config = {
    env: process.env.NODE_ENV || "development",
    mongoUrl: process.env.MONGO_URL || "mongodb://mongo:27017/taskboard",
    redisUrl: process.env.REDIS_URL || "redis://redis:6379",
    rabbitUrl: process.env.RABBIT_URL || "amqp://rabbitmq:5672",
};
