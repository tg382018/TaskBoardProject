import { config } from "./config/env.js";
import { logger } from "./utils/logger.js";

import { connectMongo } from "./config/mongo.js";
import { connectRedis } from "./config/redis.js";
import { connectRabbit } from "./config/rabbit.js";

import { startTaskboardConsumer } from "./consumers/taskboard.consumer.js";

async function bootstrap() {
    logger.info(`starting... env=${config.env}`);

    await connectMongo(config.mongoUrl);
    connectRedis(config.redisUrl);

    const { channel } = await connectRabbit(config.rabbitUrl);

    await startTaskboardConsumer(channel);

    logger.info("bootstrap ok (infra connected + consumer started)");
}

bootstrap().catch((err) => {
    logger.error("bootstrap failed", err);
    process.exit(1);
});
