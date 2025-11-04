/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  detectOpenHandles: false,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 100000,
  testRegex: "test/.*test.*\\.ts$",
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",  // Исключает скомпилированные файлы
    "\\.d\\.ts$",  // Игнорирует файлы .d.ts
  ],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^test/(.*)$': '<rootDir>/test/$1',
  },
};

