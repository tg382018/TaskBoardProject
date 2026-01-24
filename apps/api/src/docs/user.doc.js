export const userDocs = {
    "/users/me": {
        get: {
            tags: ["Users"],
            summary: "Get current user profile",
            security: [{ bearerAuth: [] }],
            responses: {
                200: { description: "User profile data" }
            }
        },
        patch: {
            tags: ["Users"],
            summary: "Update user profile",
            security: [{ bearerAuth: [] }],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                name: { type: "string", minLength: 2, maxLength: 50 }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Profile updated" }
            }
        }
    },
    "/users/sessions": {
        get: {
            tags: ["Users"],
            summary: "List active sessions",
            security: [{ bearerAuth: [] }],
            responses: {
                200: { description: "Session list" }
            }
        }
    },
    "/users/logout-all": {
        post: {
            tags: ["Users"],
            summary: "Logout from all devices",
            security: [{ bearerAuth: [] }],
            responses: {
                200: { description: "Logged out from all devices" }
            }
        }
    }
};
