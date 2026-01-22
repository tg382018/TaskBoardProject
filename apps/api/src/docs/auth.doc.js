export const authDocs = {
    "/auth/otp/request": {
        post: {
            tags: ["Auth"],
            summary: "Request OTP code",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email"],
                            properties: {
                                email: { type: "string", format: "email" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "OTP sent successfully" },
                400: { description: "Invalid email" },
                429: { description: "Too many requests" }
            }
        }
    },
    "/auth/otp/verify": {
        post: {
            tags: ["Auth"],
            summary: "Verify OTP code",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email", "code"],
                            properties: {
                                email: { type: "string", format: "email" },
                                code: { type: "string", minLength: 6, maxLength: 6 }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Logged in successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/LoginResponse" } } } },
                401: { description: "Invalid code" }
            }
        }
    },
    "/auth/refresh": {
        post: {
            tags: ["Auth"],
            summary: "Refresh access token",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["refreshToken"],
                            properties: {
                                refreshToken: { type: "string" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Token refreshed" },
                401: { description: "Invalid refresh token" }
            }
        }
    }
};
