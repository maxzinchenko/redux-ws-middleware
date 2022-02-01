module.exports = {
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'text-summary'],
  testMatch: ['<rootDir>/src/**/*.test.{tsx,ts}'],
  testPathIgnorePatterns: ['<rootDir>/types/'],
  moduleFileExtensions: ['tx', 'tsx'],
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};
