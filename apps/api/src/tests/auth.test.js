import { jest } from "@jest/globals";
import { describe, it, expect, beforeEach, beforeAll, afterAll } from "@jest/globals";
import * as authService from "../modules/auth/service.js";
import { User } from "../modules/users/repository.js";
import bcrypt from "bcrypt";
import { connectTestDb, closeTestDb } from "./setup.js";

describe("Auth Service Integration", () => {
    beforeAll(async () => {
        await connectTestDb();
    });

    afterAll(async () => {
        await closeTestDb();
    });

    beforeEach(async () => {
        await User.deleteMany({});
        jest.clearAllMocks();
    });

    describe("register", () => {
        it("should create a new user in the database", async () => {
            const userData = {
                email: "integration@test.com",
                password: "password123",
                name: "Integration Test",
                ip: "127.0.0.1",
            };

            const result = await authService.register(userData);

            expect(result.ok).toBe(true);

            const userInDb = await User.findOne({ email: userData.email });
            expect(userInDb).toBeTruthy();
            expect(userInDb.name).toBe(userData.name);
            expect(userInDb.isVerified).toBe(true);

            const isMatch = await bcrypt.compare(userData.password, userInDb.password);
            expect(isMatch).toBe(true);
        });

        it("should fail if user already exists", async () => {
            const userData = {
                email: "duplicate@test.com",
                password: "password123",
                name: "Dup Test",
                ip: "127.0.0.1",
            };

            await authService.register(userData);
            await expect(authService.register(userData)).rejects.toThrow("User already exists");
        });
    });

    describe("login", () => {
        it("should authenticate user with correct credentials", async () => {
            const userData = {
                email: "login@test.com",
                password: "password123",
                name: "Login Test",
                ip: "127.0.0.1",
            };
            await authService.register(userData);

            const loginResult = await authService.login({
                email: userData.email,
                password: userData.password,
                ip: userData.ip,
            });

            expect(loginResult.ok).toBe(true);
            expect(loginResult.message).toContain("OTP sent");
        });

        it("should fail with wrong password", async () => {
            const userData = {
                email: "wrongpass@test.com",
                password: "password123",
                name: "WrongPass Test",
                ip: "127.0.0.1",
            };
            await authService.register(userData);

            await expect(
                authService.login({
                    email: userData.email,
                    password: "wrong",
                    ip: "127.0.0.1",
                })
            ).rejects.toThrow("Invalid email or password");
        });
    });
});
