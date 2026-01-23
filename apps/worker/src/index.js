import { config } from "./config/env.js";
import { logger } from "./utils/logger.js";
import http from "http";

import { connectMongo } from "./config/mongo.js";
import { connectRedis } from "./config/redis.js";
import { connectRabbit } from "./config/rabbit.js";

import { startTaskboardConsumer } from "./consumers/taskboard.consumer.js";
import { startDailySummaryCron, generateDailySummaries } from "./jobs/daily-summary.js";

async function bootstrap() {
    logger.info(`starting... env=${config.env}`);

    await connectMongo(config.mongoUrl);
    connectRedis(config.redisUrl);

    const { channel } = await connectRabbit(config.rabbitUrl);

    await startTaskboardConsumer(channel);

    // Start cron jobs
    startDailySummaryCron();

    // Simple HTTP server for manual job triggers (development only)
    if (config.env === "development") {
        const server = http.createServer(async (req, res) => {
            if (req.url === "/trigger-daily-summary" && req.method === "POST") {
                logger.info("[HTTP] Manually triggering daily summary...");
                try {
                    await generateDailySummaries();
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ ok: true, message: "Daily summary generated" }));
                } catch (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: err.message }));
                }
            } else {
                res.writeHead(404);
                res.end("Not found");
            }
        });
        server.listen(4000, () => {
            logger.info("[HTTP] Worker admin server listening on :4000");
        });
    }

    logger.info("bootstrap ok (infra connected + consumer started + crons scheduled)");
}

bootstrap().catch((err) => {
    logger.error("bootstrap failed", err);
    process.exit(1);
});
