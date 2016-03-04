'use strict';
/* eslint-env mocha */
/* eslint-disable func-names */
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var R = require('ramda');
var isList = require('./app/stored-defaults').isList;
var storedDefaultsObj = require('./app/stored-defaults').storedDefaultsObj;
var getListDefault = require('./app/stored-defaults').getListDefault;
var getDefault = require('./app/stored-defaults').getDefault;
var storedDefaults = require('./app/stored-defaults').storedDefaults;

var defaults = {
  moduleName: 'module',
  githubUsername: 'username',
  website: 'test.com',
  moduleDesc: 'Your awsm module!',
};

it('pickup default value for stored prompts', function () {
  var input = [{
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
  }, {
    name: 'username',
    default: 'asd',
  }, {
    name: 'website',
    message: '☯ your website:',
    store: true,
    validate: function () {},
    filter: function () {},
  }];

  assert.equal(isList(input[0]), false);
  assert.equal(getDefault(input[0]), '0.0.0');
  assert.deepEqual(storedDefaultsObj(input[0]), { moduleVersion: '0.0.0' });

  assert.equal(isList(input[1]), false);
  assert.equal(getDefault(input[1]), 'MIT');
  assert.deepEqual(storedDefaultsObj(input[1]), { moduleLicense: 'MIT' });

  assert.equal(isList(input[2]), true);
  assert.equal(getListDefault(input[2]), 'tape');
  assert.equal(getDefault(input[2]), 'tape');
  assert.deepEqual(storedDefaultsObj(input[2]), { moduleTest: 'tape' });

  assert.deepEqual(storedDefaults(input), {
    moduleVersion: '0.0.0',
    moduleLicense: 'MIT',
    moduleTest: 'tape',
  });
});

it('generates expected files', function (done) {
  helpers.run(path.join(__dirname, './app'))
    .withPrompts(R.merge(defaults, { moduleTest: 'tape' }))
    .on('end', function () {
      assert.file([
        '.editorconfig',
        '.gitignore',
        '.travis.yml',
        '.babelrc',
        'package.json',
        'index.js',
        'test.js',
        'README.md',
        '.eslintrc.json',
        '.git',
      ]);
      done();
    });
});

it('generates all needed for mocha', function (done) {
  helpers.run(path.join(__dirname, './app'))
    .withOptions({ all: true })
    .withPrompts(R.merge(defaults, { moduleTest: 'mocha' }))
    .on('end', function () {
      assert.jsonFileContent('package.json', {
        scripts: { test: 'mocha --require babel-register' },
      });
      assert.fileContent('package.json', /assert/);
      assert.fileContent('package.json', /mocha/);
      assert.fileContent('test.js', /mocha/);
      done();
    });
});

it('generates all needed for tape', function (done) {
  helpers.run(path.join(__dirname, './app'))
    .withOptions({ all: true })
    .withPrompts(R.merge(defaults, { moduleTest: 'tape' }))
    .on('end', function () {
      assert.jsonFileContent('package.json', {
        scripts: { test: 'tape test.js --require babel-register | tap-spec' },
      });
      assert.fileContent('package.json', /tap-spec/);
      assert.fileContent('package.json', /tape/);
      assert.fileContent('test.js', /tape/);
      done();
    });
});

it('generates all needed for ava', function (done) {
  helpers.run(path.join(__dirname, './app'))
    .withOptions({ all: true })
    .withPrompts(R.merge(defaults, { moduleTest: 'ava' }))
    .on('end', function () {
      assert.jsonFileContent('package.json', {
        scripts: { test: 'ava --require babel-register' },
      });
      assert.fileContent('package.json', /ava/);
      assert.fileContent('test.js', /ava/);
      done();
    });
});
