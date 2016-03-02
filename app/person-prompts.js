var normalizeUrl = require('normalize-url');
var ifEmpty = require('if-empty');

function getPersonPrompts() {
  return [{
    name: 'name',
    message: '☯ your name:',
    store: true,
    validate: ifEmpty('You have to provide name'),
  }, {
    name: 'email',
    message: '☯ your email:',
    store: true,
    validate: ifEmpty('You have to provide email'),
  }, {
    name: 'website',
    message: '☯ your website:',
    store: true,
    validate: ifEmpty('You have to provide website'),
    filter: normalizeUrl,
  }, {
    name: 'githubUsername',
    message: '☯ your github username:',
    store: true,
    validate: ifEmpty('You have to provide a username'),
  }, {
    name: 'moduleTest',
    message: '☯ preferred test framework:',
    type: 'list',
    choices: ['mocha', 'tape', 'ava'],
    store: true,
    default: 1,
  }];
}

module.exports = getPersonPrompts;
