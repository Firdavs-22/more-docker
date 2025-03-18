module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/dist"],
    testPathIgnorePatterns: ["/node_modules/"],
    testMatch: ["**/*.test.js", "**/*.test.ts"],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    moduleNameMapper: {
        "^@routes$": "<rootDir>/dist/routes",
        "^@logger$": "<rootDir>/dist/utils/logger",
        "^@db$": "<rootDir>/dist/db",
        "^@models$": "<rootDir>/dist/models",
        "^@utils$": "<rootDir>/dist/utils",
        "^@enums$": "<rootDir>/dist/enums",
        "^@controllers$": "<rootDir>/dist/controllers",
        "^@app$": "<rootDir>/dist/app"
    }
};