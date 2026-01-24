import { TaskStatus, TaskPriority } from "@packages/common/constants.js";

export const taskDocs = {
    "/tasks": {
        get: {
            tags: ["Tasks"],
            summary: "List tasks for a project",
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: "projectId", in: "query", required: true, schema: { type: "string" } },
            ],
            responses: {
                200: { description: "Task list" },
            },
        },
        post: {
            tags: ["Tasks"],
            summary: "Create a new task",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["title", "projectId"],
                            properties: {
                                title: { type: "string" },
                                projectId: { type: "string" },
                                description: { type: "string" },
                                priority: { type: "string", enum: ["Low", "Medium", "High"] },
                                status: { type: "string", enum: ["Todo", "InProgress", "Done"] },
                            },
                        },
                    },
                },
            },
            responses: {
                201: { description: "Task created" },
            },
        },
    },
    "/tasks/{id}": {
        patch: {
            tags: ["Tasks"],
            summary: "Update task",
            security: [{ bearerAuth: [] }],
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                status: { type: "string", enum: Object.values(TaskStatus) },
                                priority: { type: "string", enum: Object.values(TaskPriority) },
                                assigneeId: { type: "string" },
                            },
                        },
                    },
                },
            },
            responses: {
                200: { description: "Task updated" },
            },
        },
        delete: {
            tags: ["Tasks"],
            summary: "Delete task",
            security: [{ bearerAuth: [] }],
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            responses: {
                204: { description: "Task deleted" },
            },
        },
    },
};
