import { config } from "./config/env.js";
import { createApp } from "./app.js";
import { logger } from "./utils/logger.js";

import { connectMongo } from "./config/mongo.js";
import { connectRedis } from "./config/redis.js";
import { connectRabbit } from "./config/rabbit.js";

import http from "http";
import { loadSocket } from "./loaders/socket.js";

async function bootstrap() {
    // connect infra
    await connectMongo(config.mongoUrl);
    connectRedis(config.redisUrl);
    await connectRabbit(config.rabbitUrl);

    // start api
    const app = createApp({ corsOrigins: config.corsOrigins });
    const server = http.createServer(app);

    // loaders
    const io = loadSocket(server, { corsOrigins: config.corsOrigins });
    app.set("io", io); // make io accessible in controllers if needed

    server.listen(config.port, () => {
        logger.info(`API running on http://localhost:${config.port}`);
    });
}

bootstrap().catch((err) => {
    logger.error("bootstrap failed", err);
    process.exit(1);
});
