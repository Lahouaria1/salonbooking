module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.js$': 'babel-jest', // Use babel-jest if you're using ES modules
  },
  setupFiles: ["./jest.setup.js"], // Correct path to the setup file
};
