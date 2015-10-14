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

      var cpTpl = function (from, to) {
        this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), tpl);
      }.bind(this);

      cpTpl('_index.js',      'index.js');
      cpTpl('_package.json',  'package.json');
      cpTpl('_README.md',     'README.md');
      cpTpl('_index.spec.js', 'test/index.spec.js');
      cpTpl('editorconfig',   '.editorconfig');
      cpTpl('gitignore',      '.gitignore');
      cpTpl('npmignore',      '.npmignore');
      cpTpl('travis.yml',     '.travis.yml');

      cb();
    }.bind(this));
  },
  install: function () {
    this.installDependencies({bower: false});
  }
});
