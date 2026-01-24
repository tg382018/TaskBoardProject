export default {
    testEnvironment: "node",
    transform: {},
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    testMatch: ["**/src/tests/**/*.test.js"],
    verbose: true,
    testTimeout: 30000,
    setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"],
};
