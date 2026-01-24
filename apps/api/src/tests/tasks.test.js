import { jest, describe, it, expect, beforeEach, beforeAll, afterAll } from "@jest/globals";
import { connectTestDb, closeTestDb } from "./setup.js";
import * as tasksService from "../modules/tasks/service.js";
import { Project } from "../modules/projects/repository.js";
import { Task } from "../modules/tasks/repository.js";
import { User } from "../modules/users/repository.js";
import mongoose from "mongoose";

describe("Tasks Service Integration", () => {
    let testUserId;
    let testProjectId;

    beforeAll(async () => {
        await connectTestDb();
    });

    afterAll(async () => {
        await closeTestDb();
    });

    beforeEach(async () => {
        await Project.deleteMany({});
        await Task.deleteMany({});
        await User.deleteMany({});
        jest.clearAllMocks();

        const user = await User.create({
            email: "taskowner@test.com",
            password: "hashedpassword",
            name: "Task Owner",
            isVerified: true,
        });
        testUserId = user._id.toString();

        const project = await Project.create({
            title: "Integration Project",
            ownerId: testUserId,
            members: [],
        });
        testProjectId = project._id.toString();
    });

    describe("createTask", () => {
        it("should persist task to database", async () => {
            const taskData = {
                title: "Real Integration Task",
                projectId: testProjectId,
                priority: "High",
                status: "Todo",
            };

            const task = await tasksService.createNewTask(testUserId, taskData);

            expect(task).toBeTruthy();
            expect(task._id).toBeDefined();
            expect(task.title).toBe(taskData.title);

            const dbTask = await Task.findById(task._id);
            expect(dbTask).toBeTruthy();
            expect(dbTask.creatorId.toString()).toBe(testUserId);
        });

        it("should fail if user is not authorized for project", async () => {
            const alienUserId = new mongoose.Types.ObjectId().toString();
            const taskData = {
                title: "Unauthorized Task",
                projectId: testProjectId,
            };

            await expect(tasksService.createNewTask(alienUserId, taskData)).rejects.toThrow(
                "Unauthorized"
            );
        });
    });

    describe("getTaskById", () => {
        it("should retrieve created task", async () => {
            const taskData = {
                title: "Fetch Me",
                projectId: testProjectId,
                priority: "Low",
            };
            const created = await tasksService.createNewTask(testUserId, taskData);

            const fetched = await tasksService.getTaskById(testUserId, created._id);
            expect(fetched.title).toBe(taskData.title);
        });
    });
});
