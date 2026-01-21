import { getRabbitChannel } from "../config/rabbit.js";
import { RABBIT } from "../../../../packages/common/src/rabbit-topology.js";

/**
 * Generic event publisher
 
 */
export async function publishEvent(routingKey, payload) {
    const channel = getRabbitChannel();
    if (!channel) return;

    const body = Buffer.from(JSON.stringify(payload), "utf-8"); // JSON > BUFFER ILE UTF8 FORMATINA

    await channel.assertExchange(RABBIT.exchange, RABBIT.exchangeType, {
        durable: true,
    });

    channel.publish(RABBIT.exchange, routingKey, body, { //GENEL EXCHANGE BILGILERI TOPOLOGYDEN ALIP ROUTINKEY VE BODY I YOLLARIZ
        contentType: "application/json",
        persistent: true,
    });
}
