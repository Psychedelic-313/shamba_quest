module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@\/(.*)$': '<rootDir>/$1',
  },
  // Ignore e2e tests that are run by Playwright separately
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/tests/e2e/'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
}
