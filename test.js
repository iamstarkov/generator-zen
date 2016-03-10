'use strict';
/* eslint-env mocha */
/* eslint-disable func-names */
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var R = require('ramda');
var depsObject = require('deps-object');
var testFrameworksHash = require('./app/test-frameworks');

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
  var testFramework = R.prop('mocha', testFrameworksHash);
  var scripts = R.pick(['test', 'tdd'], testFramework);
  var deps = R.prop('deps', testFramework);
  depsObject(deps).then(function (devDeps) {
    helpers.run(path.join(__dirname, './app'))
      .withOptions({ all: true })
      .withPrompts(R.merge(defaults, { moduleTest: 'mocha' }))
      .on('end', function () {
        assert.jsonFileContent('package.json', {
          scripts: scripts,
          devDependencies: devDeps,
        });
        assert.fileContent('test.js', /mocha/);
        done();
      });
  });
});

it('generates all needed for tape', function (done) {
  var testFramework = R.prop('tape', testFrameworksHash);
  var scripts = R.pick(['test', 'tdd'], testFramework);
  var deps = R.prop('deps', testFramework);
  depsObject(deps).then(function (devDeps) {
    helpers.run(path.join(__dirname, './app'))
      .withOptions({ all: true, debug: true })
      .withPrompts(R.merge(defaults, { moduleTest: 'tape' }))
      .on('end', function () {
        assert.jsonFileContent('package.json', {
          scripts: scripts,
          devDependencies: devDeps,
        });
        assert.fileContent('test.js', /tape/);
        done();
      });
  });
});

it('generates all needed for ava', function (done) {
  var testFramework = R.prop('ava', testFrameworksHash);
  var scripts = R.pick(['test', 'tdd'], testFramework);
  var deps = R.prop('deps', testFramework);
  depsObject(deps).then(function (devDeps) {
    helpers.run(path.join(__dirname, './app'))
      .withOptions({ all: true })
      .withPrompts(R.merge(defaults, { moduleTest: 'ava' }))
      .on('end', function () {
        assert.jsonFileContent('package.json', {
          scripts: scripts,
          devDependencies: devDeps,
        });
        assert.fileContent('test.js', /ava/);
        done();
      });
  });
});
