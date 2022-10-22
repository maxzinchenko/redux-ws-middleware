/** @returns {import('jest').Config} */
module.exports = {
  rootDir: '../',
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'text-summary'],
  testMatch: ['<rootDir>/src/**/*.test.{js,ts}'],
  testPathIgnorePatterns: ['<rootDir>/types/'],
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'jest-environment-jsdom',

  transform: {
    '^.+\\.tsx?$': ['ts-jest']
  },

  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};

