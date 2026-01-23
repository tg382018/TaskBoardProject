export const registerSchema = {
    type: "object",
    required: ["email", "password", "name"],
    properties: {
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 6 },
        name: { type: "string", minLength: 2 },
    },
    additionalProperties: false,
};

export const loginSchema = {
    type: "object",
    required: ["email", "password"],
    properties: {
        email: { type: "string", format: "email" },
        password: { type: "string" },
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

export const resendOtpSchema = {
    type: "object",
    required: ["email"],
    properties: {
        email: { type: "string", format: "email" },
    },
    additionalProperties: false,
};
