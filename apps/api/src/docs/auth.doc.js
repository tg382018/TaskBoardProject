export const authDocs = {
    "/auth/register": {
        post: {
            tags: ["Auth"],
            summary: "Register new user (or complete shadow user)",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email", "password", "name"],
                            properties: {
                                email: { type: "string", format: "email" },
                                password: { type: "string", minLength: 6 },
                                name: { type: "string" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "OTP sent to email" },
                400: { description: "User already exists or invalid input" }
            }
        }
    },
    "/auth/login": {
        post: {
            tags: ["Auth"],
            summary: "Login with email/password (triggers OTP)",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email", "password"],
                            properties: {
                                email: { type: "string", format: "email" },
                                password: { type: "string" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Password correct, OTP sent" },
                401: { description: "Invalid credentials" }
            }
        }
    },
    "/auth/verify": {
        post: {
            tags: ["Auth"],
            summary: "Verify OTP and get tokens",
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
                200: {
                    description: "Authenticated successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/LoginResponse" }
                        }
                    }
                },
                401: { description: "Invalid OTP" }
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
