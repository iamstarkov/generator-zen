function getPrefPropmts() {
  return [{
    name: 'moduleVersion',
    message: '☯ preferred version to start:',
    store: true,
    default: '0.0.0',
  }, {
    name: 'moduleLicense',
    message: '☯ preferred license:',
    store: true,
    default: 'MIT',
  }, {
    name: 'moduleTest',
    message: '☯ preferred test framework:',
    type: 'list',
    choices: ['mocha', 'tape', 'ava'],
    store: true,
    default: 1,
  }];
}

module.exports = getPrefPropmts;
