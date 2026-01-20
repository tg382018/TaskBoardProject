// utils/events.js
import { getRabbitChannel } from "../config/rabbit.js";
import { RABBIT } from "../../../packages/common/src/rabbit-topology.js";

export async function publishEvent(routingKey, payload) {
  const channel = getRabbitChannel();
  const body = Buffer.from(JSON.stringify(payload), "utf-8");

  await channel.assertExchange(RABBIT.exchange, RABBIT.exchangeType, {
    durable: true,
  });

  channel.publish(RABBIT.exchange, routingKey, body, {
    contentType: "application/json",
    persistent: true,
  });
}