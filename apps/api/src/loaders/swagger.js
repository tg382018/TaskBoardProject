import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../docs/index.js";

/**
 * Swagger UI Loader
 * Ref: aa.txt line 15 (modular setup)
 */
export function loadSwagger(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            persistAuthorization: true,
        },
        customSiteTitle: "TaskBoard API Docs",
    }));
}
