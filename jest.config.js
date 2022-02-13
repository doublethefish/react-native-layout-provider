module.exports = {
  preset: "react-native",
  clearMocks: true,
  coverageDirectory: "./docs/coverage",
  setupFiles: ["./test/setup.js"],
  setupFilesAfterEnv: [],
  testEnvironment: "node",
  transformIgnorePatterns: ["node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"],
  verbose: true,
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      line: 100,
    },
  },
};
