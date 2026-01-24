import { loadExpress } from "./express.js";
import { loadSwagger } from "./swagger.js";
import { loadSocket } from "./socket.js";
import { loadRabbit } from "./rabbit.js";
import { connectMongo } from "../config/mongo.js";
import { connectRedis } from "../config/redis.js";
import { config } from "../config/env.js";
import { logger } from "../utils/logger.js";

export async function loadAll(app, server) {
    // 1. Database Connections
    logger.info("Loader: Connecting to Mongo...");
    await connectMongo(config.mongoUrl);

    logger.info("Loader: Connecting to Redis...");
    connectRedis(config.redisUrl);

    // 2. Message Broker
    logger.info("Loader: Connecting to RabbitMQ...");
    await loadRabbit();

    // 3. Express Middlewares
    logger.info("Loader: Configuring Express...");
    loadExpress(app, { corsOrigins: config.corsOrigins });

    // 4. Swagger Documentation
    logger.info("Loader: Configuring Swagger...");
    loadSwagger(app);

    // 5. Socket.io
    logger.info("Loader: Configuring Socket.io...");
    const io = loadSocket(server, { corsOrigins: config.corsOrigins });
    app.set("io", io);

    return { io };
}
