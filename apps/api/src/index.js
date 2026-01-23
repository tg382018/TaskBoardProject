import { config } from "./config/env.js";
import { createApp } from "./app.js";
import { logger } from "./utils/logger.js";

import { connectMongo } from "./config/mongo.js";
import { connectRedis } from "./config/redis.js";
import { connectRabbit } from "./config/rabbit.js";

import http from "http";
import { loadSocket } from "./loaders/socket.js";

async function bootstrap() {
    try {
        // connect infra
        logger.info("Connecting to Mongo...");
        await connectMongo(config.mongoUrl);
        logger.info("Connecting to Redis...");
        connectRedis(config.redisUrl);
        logger.info("Connecting to Rabbit...");
        await connectRabbit(config.rabbitUrl);

        // start api
        logger.info("Creating App...");
        const app = createApp({ corsOrigins: config.corsOrigins });
        const server = http.createServer(app);

        // loaders
        logger.info("Loading Socket...");
        const io = loadSocket(server, { corsOrigins: config.corsOrigins });
        app.set("io", io); // make io accessible in controllers if needed

        server.listen(config.port, () => {
            logger.info(`API running on http://localhost:${config.port}`);
        });
    } catch (err) {
        console.error("BOOTSTRAP ERROR DETAILED:", err);
        logger.error("bootstrap failed", err);
        process.exit(1);
    }
}

bootstrap();
