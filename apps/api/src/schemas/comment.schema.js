export const createCommentSchema = {
    type: "object",
    required: ["content", "taskId"],
    properties: {
        content: { type: "string", minLength: 1, maxLength: 1000 },
        taskId: { type: "string", pattern: "^[0-9a-fA-F]{24}$" },
    },
    additionalProperties: false,
};
