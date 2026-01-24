import { config } from "./config/env.js";
import { createApp } from "./app.js";
import { logger } from "./utils/logger.js";
import { loadAll } from "./loaders/index.js";
import http from "http";

async function bootstrap() {
    try {
        // Create App & Server
        logger.info("Bootstrap: Creating App...");
        const app = createApp({ corsOrigins: config.corsOrigins });
        const server = http.createServer(app);

        // Load Everything (DB, Rabbit, Middlewares, Socket, etc.)
        await loadAll(app, server);

        // Start Server
        server.listen(config.port, () => {
            logger.info(`API running on http://localhost:${config.port}`);
        });
    } catch (err) {
        console.error("BOOTSTRAP ERROR DETAILED:", err);
        logger.error("bootstrap failed", err);
        process.exit(1);
    }
}

bootstrap();
