module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["."],
    testPathIgnorePatterns: ["/node_modules/",",/dist/"],
    testMatch: ["**/*.test.ts"],
    moduleNameMapper: {
        '^@app$': '<rootDir>/src/app',
        '^@enums/(.*)$': '<rootDir>/src/enums/$1',
        '@logger': '<rootDir>/src/utils/logger/',
        '@db': '<rootDir>/src/db/',
        '^@models/(.*)$': '<rootDir>/src/models/$1',
        '@routes': '<rootDir>/src/routes/',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
        '^@/(.*)$': '<rootDir>/src/$1'
    }
}

