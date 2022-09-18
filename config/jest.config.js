/** @returns {import('jest').Config} */
module.exports = {
  "rootDir": "../",
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'text-summary'],
  testMatch: ['<rootDir>/src/**/*.test.{js,ts}'],
  testPathIgnorePatterns: ['<rootDir>/types/'],
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'jest-environment-jsdom',

  moduleNameMapper: {
    '~/middleware(.*)': '<rootDir>/src/middleware/$1',
    '~/services/(.*)': '<rootDir>/src/services/$1'
  },
  
  transform: {
    '^.+\\.tsx?$': ['ts-jest']
  },

  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};

