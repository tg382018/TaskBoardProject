import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../docs/index.js";


export function loadSwagger(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        //spec içerisinde schema vs var 
        swaggerOptions: {
            persistAuthorization: true,
            //bearer token 
        },
        customSiteTitle: "TaskBoard API Docs",
    }));
}
