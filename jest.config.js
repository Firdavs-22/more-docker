module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["."],
    testPathIgnorePatterns: ["/node_modules/",",/dist/"],
    testMatch: ["**/*.test.ts"]
}

