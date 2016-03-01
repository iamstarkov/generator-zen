'use strict';
/* eslint-env mocha */
/* eslint-disable func-names */
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var R = require('ramda');

var defaults = {
  moduleName: 'module',
  githubUsername: 'username',
  website: 'test.com',
  moduleDesc: 'Your awsm module!',
};

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
    .withPrompts(R.merge(defaults, { moduleTest: 'mocha' }))
    .on('end', function () {
      assert.jsonFileContent('package.json', {
        scripts: { test: 'mocha --require babel-register' },
      });
      assert.fileContent('package.json', /assert/);
      assert.fileContent('package.json', /mocha/);
      done();
    });
});

it('generates all needed for tape', function (done) {
  helpers.run(path.join(__dirname, './app'))
    .withPrompts(R.merge(defaults, { moduleTest: 'tape' }))
    .on('end', function () {
      assert.jsonFileContent('package.json', {
        scripts: { test: 'tape test.js --require babel-register | tap-spec' },
      });
      assert.fileContent('package.json', /tap-spec/);
      assert.fileContent('package.json', /tape/);
      done();
    });
});

it('generates all needed for ava', function (done) {
  helpers.run(path.join(__dirname, './app'))
    .withPrompts(R.merge(defaults, { moduleTest: 'ava' }))
    .on('end', function () {
      assert.jsonFileContent('package.json', {
        scripts: { test: 'ava --require babel-register' },
      });
      assert.fileContent('package.json', /ava/);
      done();
    });
});
