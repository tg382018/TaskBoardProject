import { config } from "./config/env.js";
import { logger } from "./utils/logger.js";

async function bootstrap() {
    logger.info(`starting... env=${config.env}`);

    // TASK4'te buraya eklenecek:
    // - rabbit connect
    // - mongo connect
    // - redis connect
    // - consumers bind

    logger.info("bootstrap ok (no consumers yet)");
}

bootstrap().catch((err) => {
    logger.error("bootstrap failed", err);
    process.exit(1);
});
