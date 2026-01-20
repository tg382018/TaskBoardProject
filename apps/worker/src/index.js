import { config } from "./config/env.js";
import { logger } from "./utils/logger.js";

import { connectMongo } from "./config/mongo.js";
import { connectRedis } from "./config/redis.js";
import { connectRabbit } from "./config/rabbit.js";

async function bootstrap() {
    logger.info(`starting... env=${config.env}`);

    await connectMongo(config.mongoUrl);
    connectRedis(config.redisUrl);
    await connectRabbit(config.rabbitUrl);

    logger.info("bootstrap ok (infra connected)");
}

bootstrap().catch((err) => {
    logger.error("bootstrap failed", err);
    process.exit(1);
});
