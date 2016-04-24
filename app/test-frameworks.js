var testFrameworksHash = {
  mocha: {
    test: 'mocha --require babel-register',
    tdd: 'npm test -- --watch',
    deps: ['assert@^1.3.0', 'mocha@^2.4.5'],
    eslint: {
      extends: 'airbnb-base',
      plugins: ['require-path-exists', 'import'] }
  },
  tape: {
    test: 'tape test.js --require babel-register | tap-spec',
    tdd: 'chokidar *.js --command \'npm test\' --initial --throttle=50 --polling',
    deps: ['tap-spec@^4.1.1', 'tape@^4.4.0', 'chokidar-cli@^1.2.0'],
    eslint: {
      extends: 'airbnb-base',
      plugins: ['require-path-exists', 'import'] }
  },
  ava: {
    test: 'ava --require babel-register',
    tdd: 'npm test -- --watch',
    deps: ['ava@^0.14.0', 'chokidar@^1.4.3', 'babel-eslint@^6.0.3'],
    eslint: {
      parser: 'babel-eslint',
      extends: 'airbnb-base',
      plugins: ['require-path-exists', 'import'] }
  }
};

module.exports = testFrameworksHash;
