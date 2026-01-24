/* global describe, it, expect, afterEach */

import { jest } from "@jest/globals";

// Mock dependencies
jest.unstable_mockModule("../services/notify.js", () => ({
    sendNotification: jest.fn(),
    sendBroadcast: jest.fn(),
    default: { sendNotification: jest.fn(), sendBroadcast: jest.fn() },
}));

jest.unstable_mockModule("../services/report.js", () => ({
    recordEvent: jest.fn(),
    trackEvent: jest.fn(), // Added missing export
    getEventStats: jest.fn(),
    default: { recordEvent: jest.fn(), trackEvent: jest.fn(), getEventStats: jest.fn() },
}));

jest.unstable_mockModule("../utils/logger.js", () => ({
    logger: { info: jest.fn(), warn: jest.fn(), debug: jest.fn(), error: jest.fn() },
}));

const notifyService = await import("../services/notify.js");
const reportService = await import("../services/report.js");
const notifier = await import("../consumers/notifier.consumer.js");
const analytics = await import("../consumers/analytics.consumer.js");

describe("Worker Consumers", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Notifier Consumer", () => {
        it("should call sendBroadcast on task.created", async () => {
            const eventData = {
                type: "task.created",
                taskId: "123",
                title: "Test Task",
            };

            // Mock successful broadcast
            notifyService.sendBroadcast.mockResolvedValue(true);

            await notifier.handleNotification(eventData);

            expect(notifyService.sendBroadcast).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "task.created",
                    taskId: "123",
                })
            );
        });
    });

    describe("Analytics Consumer", () => {
        it("should call report service to record event", async () => {
            const eventData = {
                type: "task.completed",
                userId: "user1",
                timestamp: new Date().toISOString(),
            };

            await analytics.handleAnalytics(eventData);

            expect(reportService.trackEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "task.completed",
                    userId: "user1",
                })
            );
        });
    });
});
