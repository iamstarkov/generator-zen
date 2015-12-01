'use strict';

var yeoman = require('yeoman-generator');
var normalizeUrl = require('normalize-url');
var humanizeUrl = require('humanize-url');
var slugify = require('underscore.string').slugify;
var camelize = require('underscore.string').camelize;
var objectAssign = require('object-assign');

var merge = objectAssign.bind(Object, {});

function ifEmpty(errorMessage, val) {
  return val.length > 0 ? true : errorMessage;
}

module.exports = yeoman.generators.Base.extend({
  init: function () {
    var cb = this.async();

    this.prompt([{
      name: 'name',
      message: 'your name:',
      store: true,
      validate: ifEmpty.bind(null, 'You have to provide name')
    }, {
      name: 'email',
      message: 'your email:',
      store: true,
      validate: ifEmpty.bind(null, 'You have to provide email')
    }, {
      name: 'website',
      message: 'website:',
      store: true,
      validate: ifEmpty.bind(null, 'You have to provide website'),
      filter: normalizeUrl
   }, {
     name: 'githubUsername',
     message: 'github username:',
     store: true,
     validate: ifEmpty.bind(null, 'You have to provide a username')
   }, {
      name: 'moduleName',
      message: 'name:',
      default: this.appname.replace(/\s/g, '-'),
      filter: slugify
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
    }], function (props) {
      var tpl = {
        moduleName: props.moduleName,
        moduleDesc: props.moduleDesc,
        moduleKeywords: (props.moduleKeywords || '').trim().split(',').map(function(i) { return (i || '').trim(); }),
        moduleVersion: props.moduleVersion,
        moduleLicense: props.moduleLicense,
        camelModuleName: camelize(props.moduleName),
        githubUsername: props.githubUsername,
        name: props.name,
        email: props.email,
        website: props.website,
        humanizedWebsite: humanizeUrl(props.website)
      };

      var cpTpl = function (from, to) {
        this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), tpl);
      }.bind(this);

      cpTpl('_index.js',     'index.js');
      cpTpl('_package.json', 'package.json');
      cpTpl('_README.md',     'README.md');
      cpTpl('_test.js',      'test.js');
      cpTpl('editorconfig',  '.editorconfig');
      cpTpl('gitignore',     '.gitignore');
      cpTpl('npmignore',     '.npmignore');

      cb();
    }.bind(this));
  },
  writing: function () {
    [
      { name: 'travis', options: { config: { after_script: ['npm run coveralls'] }}},
      { name: 'git-init' },
      { name: 'babel', options: { config: { plugins: [ 'add-module-exports' ] },
        'skip-install': this.options['skip-install']
      }},
    ].forEach(function(generator) {
      this.composeWith(
        generator.name,
        { options: (generator.options || {}) },
        { local: require.resolve('generator-' + generator.name + '/generators/app') }
      );
    }.bind(this));
  },
  install: function () {
    this.installDependencies({bower: false});
  }
});
