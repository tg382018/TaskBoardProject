export const commentDocs = {
    "/comments": {
        get: {
            tags: ["Comments"],
            summary: "List comments for a task",
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: "taskId", in: "query", required: true, schema: { type: "string" } }
            ],
            responses: {
                200: { description: "Comment list" }
            }
        },
        post: {
            tags: ["Comments"],
            summary: "Add comment to task",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["content", "taskId"],
                            properties: {
                                content: { type: "string" },
                                taskId: { type: "string" }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: "Comment added" }
            }
        }
    }
};
