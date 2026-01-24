export const updateUserSchema = {
    type: "object",
    properties: {
        name: { type: "string", minLength: 2, maxLength: 50 },
    },
    minProperties: 1,
    additionalProperties: false,
};

export const changePasswordSchema = {
    type: "object",
    required: ["oldPassword", "newPassword"],
    properties: {
        oldPassword: { type: "string", minLength: 6 },
        newPassword: { type: "string", minLength: 6 },
    },
    additionalProperties: false,
};
