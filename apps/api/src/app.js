import express from "express";
import { loadExpress } from "./loaders/express.js";
import { loadSwagger } from "./loaders/swagger.js";
import { buildRoutes } from "./routes.js";
import { internalRoutes } from "./routes/internal.js";
import { notFound, errorHandler } from "./middlewares/error.js";

export function createApp({ corsOrigins }) {
    const app = express();

    // body parser
    app.use(express.json({ limit: "1mb" }));

    // global middlewares
    loadExpress(app, { corsOrigins });

    // documentation
    loadSwagger(app);

    // internal bridge (Worker -> API)
    app.use("/internal", internalRoutes(app));

    // routes
    app.use("/api", buildRoutes()); //api prefix 

    // error handlers (EN SONA)
    app.use(notFound);
    app.use(errorHandler);

    return app;
}
