export default {
    testEnvironment: "node",
    transform: {},
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    testMatch: ["**/tests/**/*.test.js"],
    verbose: true,
    testTimeout: 30000,
    setupFilesAfterEnv: ["<rootDir>/tests/setup.js"]
};
