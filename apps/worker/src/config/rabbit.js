import amqplib from "amqplib";
import { logger } from "../utils/logger.js";

export async function connectRabbit(rabbitUrl) {
    const conn = await amqplib.connect(rabbitUrl);
    const channel = await conn.createChannel();

    logger.info("rabbit connected");

    const close = async () => {
        try {
            await channel.close();
            await conn.close();
            logger.info("rabbit closed");
        } catch (_e) {
            /* Ignore close errors */
        }
    };

    process.on("SIGINT", close);
    process.on("SIGTERM", close);

    return { conn, channel };
}
