'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-assert');

describe('generator', function () {
  it('generates expected files', function (done) {
    helpers.run(path.join(__dirname, './app'))
      .withGenerators([
        [helpers.createDummyGenerator(), 'generator-babel-init/generators/app']
      ])
      .withPrompts({
        moduleName: 'module',
        githubUsername: 'username',
        website: 'test.com',
        moduleDesc: 'Your awsm module!'
      })
      .on('end', function() {
        assert.file([
          '.editorconfig',
          '.gitignore',
          '.npmignore',
          '.travis.yml',
          '.babelrc',
          'package.json',
          'index.js',
          'test.js',
          'README.md',
          '.git',
        ]);
        done();
      });
  });
});
