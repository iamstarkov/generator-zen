var R = require('ramda');
var normalizeUrl = require('normalize-url');

// ifEmpty :: String -> String -> true | String
var ifEmpty = R.uncurryN(2, R.pipe(R.always, R.ifElse(R.isEmpty, R.__, R.T)));

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
  }];
}

module.exports = getPersonPrompts;
