
import { Router } from "express";
import { getRabbitChannel } from "../../config/rabbit.js";

export function debugRoutes() {
    const router = Router();

    router.post("/publish", async (req, res) => {
        const { type, payload } = req.body || {};

        if (!type) {
            return res.status(400).json({ ok: false, error: "type is required" });
        }

        const channel = getRabbitChannel();

        // Exchange tanımı (topic)
        await channel.assertExchange("taskboard.events", "topic", { durable: true });

        const msg = {
            type,
            payload: payload ?? {},
            ts: new Date().toISOString(),
        };

        channel.publish(
            "taskboard.events",
            type, // routing key
            Buffer.from(JSON.stringify(msg)),
            { contentType: "application/json", persistent: true }
        );

        return res.json({ ok: true, published: msg });
    });

    return router;
}
