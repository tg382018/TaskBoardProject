export const createProjectSchema = {
    type: "object",
    required: ["title"], //title zorunlu boş body geçersiz
    properties: {
        title: { type: "string", minLength: 3, maxLength: 100 },
        description: { type: "string", maxLength: 500 },
    },
    additionalProperties: false,
};

export const updateProjectSchema = {
    type: "object",//1 alan zorunlu
    properties: {
        title: { type: "string", minLength: 3, maxLength: 100 },
        description: { type: "string", maxLength: 500 },
    },
    minProperties: 1,
    additionalProperties: false,
};

export const addMemberSchema = {
    type: "object",
    required: ["email"],
    properties: {
        email: { type: "string", format: "email" },
    },
    additionalProperties: false,
};
