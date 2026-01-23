import request from "supertest";
import { createApp } from "../../src/app.js";
import { User } from "../../src/modules/users/repository.js";
import { signAccessToken } from "../../src/utils/jwt.js";

const app = createApp({ corsOrigins: "*" });

describe("Projects Integration Tests", () => {
    let token;
    let userId;

    beforeAll(async () => {
        const user = await User.create({
            email: "project.tester@example.com",
            password: "Password123!",
            name: "Project Tester",
            isVerified: true
        });
        userId = user._id;
        token = signAccessToken({ id: userId, email: user.email });
    });

    it("should create a new project", async () => {
        const res = await request(app)
            .post("/api/projects")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Test Project",
                description: "Integration test project"
            });

        expect(res.status).toBe(201);
        expect(res.body.title).toBe("Test Project");
    });

    it("should list projects for the user", async () => {
        const res = await request(app)
            .get("/api/projects")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
});
