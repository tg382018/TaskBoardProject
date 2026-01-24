import { connectRabbit } from "../config/rabbit.js";
import { config } from "../config/env.js";
import { logger } from "../utils/logger.js";

export async function loadRabbit() {
    try {
        logger.info("Loading RabbitMQ...");
        const { conn, channel } = await connectRabbit(config.rabbitUrl);
        return { conn, channel };
    } catch (err) {
        logger.error("Failed to load RabbitMQ", err);
        throw err;
    }
}
