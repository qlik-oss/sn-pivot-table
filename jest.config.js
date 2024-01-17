const path = require("path");

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ["<rootDir>/jest/setup.ts"],
  testEnvironment: "jsdom",
  testMatch: ["**/src/**/__tests__/*.test.ts?(x)"],
  transformIgnorePatterns: [
    /* if config file is under '~/packages/lib-a/' */
    `${path.join(
      __dirname,
      "../..",
    )}/node_modules/.pnpm/(?!(d3-color|@qlik-trial\\+sprout|@qlik\\+nebula-table-utils)@)`,
    /* or using relative pattern to match the second 'node_modules/' in 'node_modules/.pnpm/@scope+pkg-b@x.x.x/node_modules/@scope/pkg-b/' */
    "node_modules/(?!.pnpm|d3-color|@qlik-trial/sprout|@qlik/nebula-table-utils)",
  ],
};
