/* eslint comma-dangle: 0 */

module.exports = {
  name: 'verdaccio-gitlab-functional-jest',
  verbose: true,
  rootDir: '..',
  testEnvironment: './test/functional/test-environment.js',
  collectCoverage: false,
  testRegex: 'test/functional/.*.spec\\.js',
};
