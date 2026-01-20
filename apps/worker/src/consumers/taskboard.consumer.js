
import { logger } from "../utils/logger.js";

const EXCHANGE = "taskboard.events";
const EXCHANGE_TYPE = "topic";
const QUEUE = "worker.taskboard";
const BINDINGS = ["task.*"];

export async function startTaskboardConsumer(channel) {
    await channel.assertExchange(EXCHANGE, EXCHANGE_TYPE, { durable: true });

    const q = await channel.assertQueue(QUEUE, { durable: true });

    for (const pattern of BINDINGS) {
        await channel.bindQueue(q.queue, EXCHANGE, pattern);
    }

    logger.info(`consumer ready: queue=${q.queue} bindings=${BINDINGS.join(",")}`);

    await channel.consume(
        q.queue,
        (msg) => {
            if (!msg) return;

            try {
                const event = JSON.parse(msg.content.toString("utf-8"));
                logger.info(`received event: ${event.type}`, event);
                channel.ack(msg);
            } catch (err) {
                logger.error("consume error", err);
                channel.nack(msg, false, false); // şimdilik drop
            }
        },
        { noAck: false }
    );
}

