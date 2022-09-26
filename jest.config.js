module.exports = {
  testEnvironment: 'node',
  "coveragePathIgnorePatterns": [
    "/node_modules/"
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts)x?$',
  coverageDirectory: 'coverage',
  roots: ['./'],
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      lines: 0,
      functions: 0,
    },
  },
};
