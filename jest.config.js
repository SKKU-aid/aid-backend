module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  verbose: false,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  setupFiles: ['/app/jest.setup.js'],
};
