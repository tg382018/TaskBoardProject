import request from "supertest";
import { createApp } from "../../src/app.js";

const app = createApp({ corsOrigins: "*" });

describe("Auth Integration Tests", () => {
    let testUser = {
        email: "test@example.com",
        password: "Password123!",
        name: "Test User"
    };

    it("should register a new user and send OTP", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send(testUser);

        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
    });

    it("should fail to login with wrong password", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: testUser.email,
                password: "wrong-password"
            });

        expect(res.status).toBe(401);
    });

    it("should initiate login for existing user", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
    });
});
