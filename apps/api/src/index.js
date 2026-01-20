import { createApp } from "./app.js";
import { config } from "./config/env.js";
import { logger } from "./utils/logger.js";

const app = createApp({ corsOrigins: config.corsOrigins });

app.listen(config.port, () => {
    logger.info(`API running on http://localhost:${config.port}`);
});
