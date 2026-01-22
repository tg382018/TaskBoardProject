import { logger } from "../utils/logger.js";
import { handleMail } from "./mailer.consumer.js";
import { handleNotification } from "./notifier.consumer.js";
import { handleAnalytics } from "./analytics.consumer.js";
import { RABBIT } from "../../../../packages/common/src/rabbit-topology.js";

export async function startTaskboardConsumer(channel) {
    // Topology'den ayarları çekiyoruz
    const { exchange, exchangeType, workerQueue } = RABBIT;
    const bindings = ["task.*", "otp.*", "comment.*"];

    await channel.assertExchange(exchange, exchangeType, { durable: true });
    const q = await channel.assertQueue(workerQueue, { durable: true });

    for (const pattern of bindings) {
        await channel.bindQueue(q.queue, exchange, pattern);
    }

    logger.info(`consumer ready: queue=${q.queue} bindings=${bindings.join(",")}`);

    await channel.consume(
        q.queue,
        async (msg) => {
            if (!msg) return;

            try {
                const rawBody = msg.content.toString("utf-8");
                const event = JSON.parse(rawBody);
                logger.info(`processing event: ${event.type || 'unknown'}`, { rawBody });

                if (!event.type) {
                    logger.warn("Skipping event with no type");
                    return channel.ack(msg);
                }

                // Kategorize edilmiş handler'lara dağıtıyoruz
                handleMail(event);
                handleNotification(event);
                handleAnalytics(event);

                channel.ack(msg);
            } catch (err) {
                logger.error("consume error", err);
                // Hatalı mesajı drop ediyoruz (  basitlik için dlq yok)
                channel.nack(msg, false, false);
            }
        },
        { noAck: false }
    );
}
