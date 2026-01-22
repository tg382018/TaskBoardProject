export const updateProfileSchema = {
    type: "object",
    properties: {
        name: { type: "string", minLength: 2, maxLength: 50 },
    },
    minProperties: 1,
    additionalProperties: false,
};
