import { authDocs } from "./auth.doc.js";
import { projectDocs } from "./project.doc.js";
import { taskDocs } from "./task.doc.js";
import { commentDocs } from "./comment.doc.js";
import { userDocs } from "./user.doc.js";

export const swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "TaskBoard API",
        version: "1.0.0",
        description: "Modular Task Management API Documentation",
        contact: {
            name: "Tahsin Gulcek",
        },
    },
    servers: [
        {
            url: "/api",
            description: "Main API Prefix",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            LoginResponse: {
                type: "object",
                properties: {
                    accessToken: { type: "string" },
                    refreshToken: { type: "string" },
                    user: {
                        type: "object",
                        properties: {
                            email: { type: "string" },
                            role: { type: "string" },
                        },
                    },
                },
            },
        },
    },
    paths: {
        ...authDocs,
        ...userDocs,
        ...projectDocs,
        ...taskDocs,
        ...commentDocs,
    },
};
