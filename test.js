'use strict';
/* eslint-env mocha */
/* eslint-disable func-names */
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

it('generates expected files', function (done) {
  helpers.run(path.join(__dirname, './app'))
    .withOptions({ skipInstall: true })
    .withPrompts({
      moduleName: 'module',
      githubUsername: 'username',
      website: 'test.com',
      moduleDesc: 'Your awsm module!',
      moduleTest: 'tape',
    })
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
