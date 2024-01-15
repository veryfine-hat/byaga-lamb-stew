module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '/archive'],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: './test-results/junit',
        outputName: 'junit.xml'
      }
    ],
    [
      "jest-html-reporters",
      {
        publicPath: './test-results/html',
        filename: 'index.html',
        expand: true,
        includeFailureMsg: true
      }
    ]
  ],
  collectCoverage: true,
  coverageDirectory: './test-results/coverage',
  coverageReporters: ['text', 'lcov', 'html']
};