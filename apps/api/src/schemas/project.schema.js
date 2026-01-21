export const createProjectSchema = {
    type: "object",
    required: ["title"],
    properties: {
        title: { type: "string", minLength: 3, maxLength: 100 },
        description: { type: "string", maxLength: 500 },
    },
    additionalProperties: false,
};

export const updateProjectSchema = {
    type: "object",
    properties: {
        title: { type: "string", minLength: 3, maxLength: 100 },
        description: { type: "string", maxLength: 500 },
    },
    minProperties: 1,
    additionalProperties: false,
};
