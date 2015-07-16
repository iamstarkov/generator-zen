'use strict';

var yeoman = require('yeoman-generator');
var normalizeUrl = require('normalize-url');
var humanizeUrl = require('humanize-url');
var _s = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
  init: function () {
    var cb = this.async();

    this.prompt([{
      name: 'moduleName',
      message: 'name:',
      default: this.appname.replace(/\s/g, '-'),
      filter: function (val) {
        return _s.slugify(val);
      }
    }, {
      name: 'moduleDesc',
      message: 'description:'
    }, {
      name: 'moduleKeywords',
      message: 'keywords:'
    }, {
      name: 'moduleVersion',
      message: 'version:',
      store: true,
      default: '0.0.0',
    }, {
      name: 'moduleLicense',
      message: 'license:',
      store: true,
      default: 'MIT',
    }, {
      name: 'githubUsername',
      message: 'github username:',
      store: true,
      validate: function (val) {
        return val.length > 0 ? true : 'You have to provide a username';
      }
    }, {
      name: 'website',
      message: 'website:',
      store: true,
      validate: function (val) {
        return val.length > 0 ? true : 'You have to provide a website URL';
      },
      filter: function (val) {
        return normalizeUrl(val);
      }
    }], function (props) {
      var tpl = {
        moduleName: props.moduleName,
        moduleDesc: props.moduleDesc,
        moduleKeywords: (props.moduleKeywords || '').trim().split(',').map(function(i) { return (i || '').trim(); }),
        moduleVersion: props.moduleVersion,
        moduleLicense: props.moduleLicense,
        camelModuleName: _s.camelize(props.moduleName),
        githubUsername: props.githubUsername,
        name: this.user.git.name(),
        email: this.user.git.email(),
        website: props.website,
        humanizedWebsite: humanizeUrl(props.website)
      };

      var mv = function (from, to) {
        this.fs.move(this.destinationPath(from), this.destinationPath(to));
      }.bind(this);

      this.fs.copyTpl([
        this.templatePath() + '/**'
      ], this.destinationPath(), tpl);

      mv('editorconfig',  '.editorconfig');
      mv('gitignore',     '.gitignore');
      mv('npmignore',     '.npmignore');
      mv('travis.yml',    '.travis.yml');
      mv('_README.md',     'README.md');
      mv('_package.json', 'package.json');
      mv('_index.js',     'index.js');
      mv('_test.js',      'test.js');

      cb();
    }.bind(this));
  },
  install: function () {
    this.npmInstall();
  }
});
