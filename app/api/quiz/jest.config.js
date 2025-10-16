module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    // config file lives in app/api/quiz so <rootDir> points there; map @/ to repo root
    '^@\/(.*)$': '<rootDir>/../../../$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
}

