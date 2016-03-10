var testFrameworksHash = {
  mocha: {
    test: 'mocha --require babel-register',
    tdd: 'npm test -- --watch',
    deps: ['assert@^1.3.0', 'mocha@^2.4.5'],
  },
  tape: {
    test: 'tape test.js --require babel-register | tap-spec',
    tdd: 'chokidar *.js --command \'npm test\' --initial --throttle=50 --polling',
    deps: ['tap-spec@^4.1.1', 'tape@^4.4.0', 'chokidar-cli@^1.2.0'],
  },
  ava: {
    test: 'ava --require babel-register',
    tdd: 'npm test -- --watch',
    deps: ['ava@^0.12.0'],
  },
};

module.exports = testFrameworksHash;
