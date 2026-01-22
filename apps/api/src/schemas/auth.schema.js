

// endpointler için uygun DTOlar
export const otpRequestSchema = {
    type: "object",
    required: ["email"],
    properties: {
        email: { type: "string", format: "email" },
    },
    additionalProperties: false,
};

export const otpVerifySchema = {
    type: "object",
    required: ["email", "code"],
    properties: {
        email: { type: "string", format: "email" },
        code: { type: "string", minLength: 6, maxLength: 6 },
    },
    additionalProperties: false,
};

export const refreshSchema = {
    type: "object",
    required: ["refreshToken"],
    properties: {
        refreshToken: { type: "string" },
    },
    additionalProperties: false,
};
