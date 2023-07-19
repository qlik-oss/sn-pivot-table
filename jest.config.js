/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ["<rootDir>/jest/setup.js"],
  testEnvironment: "jsdom",
  testMatch: ["**/src/**/__tests__/*.test.ts?(x)"],
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!(@qlik-trial/sprout)/)"],
};
