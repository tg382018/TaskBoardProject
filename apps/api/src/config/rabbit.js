import amqplib from "amqplib";
import { logger } from "../utils/logger.js";

let rabbitConn = null;
let rabbitChannel = null;

export async function connectRabbit(rabbitUrl) {
    rabbitConn = await amqplib.connect(rabbitUrl);
    rabbitChannel = await rabbitConn.createChannel();

    logger.info("rabbit connected");

    const close = async () => {
        try {
            await rabbitChannel?.close();
            await rabbitConn?.close();
            logger.info("rabbit closed");
        } catch (_e) {
            /* Ignore close errors */
        }
    };

    process.on("SIGINT", close);
    process.on("SIGTERM", close);

    return { conn: rabbitConn, channel: rabbitChannel };
}

export async function closeRabbit() {
    try {
        await rabbitChannel?.close();
        await rabbitConn?.close();
        rabbitChannel = null;
        rabbitConn = null;
    } catch (e) {
        // Ignore errors during close
    }
}

export function getRabbitChannel() {
    //connectrabbit çalışmadan getrabbitchannel çalıştırılırsa hata verir
    if (!rabbitChannel) throw new Error("Rabbit channel not initialized");
    return rabbitChannel;
}
