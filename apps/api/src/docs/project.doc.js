export const projectDocs = {
    "/projects": {
        get: {
            tags: ["Projects"],
            summary: "List projects (owned or member)",
            security: [{ bearerAuth: [] }],
            responses: {
                200: { description: "Project list" }
            }
        },
        post: {
            tags: ["Projects"],
            summary: "Create a new project",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["title"],
                            properties: {
                                title: { type: "string", minLength: 3 },
                                description: { type: "string" }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: "Project created" }
            }
        }
    },
    "/projects/{id}": {
        get: {
            tags: ["Projects"],
            summary: "Get project detail",
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" } }
            ],
            responses: {
                200: { description: "Project details" },
                403: { description: "Unauthorized" },
                404: { description: "Not found" }
            }
        },
        patch: {
            tags: ["Projects"],
            summary: "Update project",
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" } }
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                description: { type: "string" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Project updated" }
            }
        },
        delete: {
            tags: ["Projects"],
            summary: "Delete project",
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" } }
            ],
            responses: {
                200: { description: "Project deleted" }
            }
        }
    },
    "/projects/{id}/members": {
        post: {
            tags: ["Projects"],
            summary: "Add a member to project",
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" } }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email"],
                            properties: {
                                email: { type: "string", format: "email" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Member added successfully" },
                400: { description: "User not found or invalid input" },
                403: { description: "Only owner can add members" }
            }
        }
    }
};
