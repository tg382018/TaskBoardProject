export const createTaskSchema = {
    type: "object",
    required: ["title", "projectId"],
    properties: {
        title: { type: "string", minLength: 3, maxLength: 200 },
        description: { type: "string", maxLength: 1000 },
        projectId: { type: "string", pattern: "^[0-9a-fA-F]{24}$" },
        assigneeId: { type: "string", pattern: "^[0-9a-fA-F]{24}$" },
        priority: { type: "string", enum: ["Low", "Medium", "High"], default: "Medium" },
        tags: {
            type: "array",
            items: { type: "string", maxLength: 30 },
            maxItems: 10,
        },
    },
    additionalProperties: false,
};

export const updateTaskSchema = {
    type: "object",
    properties: {
        title: { type: "string", minLength: 3, maxLength: 200 },
        description: { type: "string", maxLength: 1000 },
        status: { type: "string", enum: ["Todo", "InProgress", "Done"] },
        priority: { type: "string", enum: ["Low", "Medium", "High"] },
        assigneeId: { type: "string", pattern: "^[0-9a-fA-F]{24}$" },
    },
    minProperties: 1,
    additionalProperties: false,
};
