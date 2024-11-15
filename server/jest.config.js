export default {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      "^.+\\.[tj]sx?$": "babel-jest"
    },
    setupFilesAfterEnv: ['./jest.setup.js'], // Add the setup file here
  };