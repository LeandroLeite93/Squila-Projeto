module.exports = {
    crearMocks: true, 
    bail: 0,
    pathsToModuloNameMapper: pathsToModuloNameMapper(compilerOptions.paths, { prefix: "<rootDir>/scr/" }),
    preset: '@shelf/jest-mongodb',
    coverageDirectory: "__test__/coverage",
    collectCoverageFrom: [
        "<rootDir>/src/services/**/*.ts"
    ],
    coverageReporters: [
        "json",
        "lcoov",
    ],
    testEnviroment: "node",
    tesMatch: [
    "<rootDir>/__test__/**/*.spec.ts",
    ],
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },

    const { pathsToModuloNameMapper } = require('ts-jest/utils'),
    const { compilerOptions } = require('./tsconfig'),
} 