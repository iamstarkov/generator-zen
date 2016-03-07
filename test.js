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
    .withOptions({ all: true })
    .withPrompts(R.merge(defaults, { moduleTest: 'mocha' }))
    .on('end', function () {
      assert.jsonFileContent('package.json', {
        scripts: { test: 'mocha --require babel-register' },
        devDependencies: {
          'assert': '^1.3.0',
          'mocha': '^2.4.5',
        }
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
        devDependencies: {
          'tap-spec': '^4.1.1',
          'tape': '^4.4.0',
        }
      });
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
        devDependencies: {
          'ava': '^0.12.0',
        }
      });
      assert.fileContent('test.js', /ava/);
      done();
    });
});
