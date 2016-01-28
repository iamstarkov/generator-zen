'use strict';
/* eslint-disable func-names */

var yeoman = require('yeoman-generator');
var normalizeUrl = require('normalize-url');
var humanizeUrl = require('humanize-url');
var slugify = require('underscore.string').slugify;
var camelize = require('underscore.string').camelize;
var R = require('ramda');

// ifEmpty :: String -> String -> true | String
var ifEmpty = R.uncurryN(2, R.pipe(R.always, R.ifElse(R.isEmpty, R.__, R.T)));

// splitKeywords :: String -> [String]
var splitKeywords = R.pipe(
  R.defaultTo(''),
  R.split(','),
  R.map(R.trim),
  R.filter(R.pipe(R.isEmpty, R.not))
);

// name :: String | Object -> String
var name = R.ifElse(R.is(String), R.identity, R.pipe(R.keys, R.head));

// options :: String | Object -> Object
var options = R.ifElse(R.is(String), R.always({}), R.pipe(R.values, R.head));

module.exports = yeoman.generators.Base.extend({
  init: function () {
    var cb = this.async();

    var personPrompts = [{
      name: 'name',
      message: 'your name:',
      store: true,
      validate: ifEmpty('You have to provide name'),
    }, {
      name: 'email',
      message: 'your email:',
      store: true,
      validate: ifEmpty('You have to provide email'),
    }, {
      name: 'website',
      message: 'website:',
      store: true,
      validate: ifEmpty('You have to provide website'),
      filter: normalizeUrl,
    }, {
      name: 'githubUsername',
      message: 'github username:',
      store: true,
      validate: ifEmpty('You have to provide a username'),
    }];

    var prefPrompts = [{
      name: 'moduleVersion',
      message: 'version:',
      store: true,
      default: '0.0.0',
    }, {
      name: 'moduleLicense',
      message: 'license:',
      store: true,
      default: 'MIT',
    }];

    var pkgPrompts = [{
      name: 'moduleName',
      message: 'name:',
      default: this.appname.replace(/\s/g, '-'),
      filter: slugify,
    }, {
      name: 'moduleDesc',
      message: 'description:',
    }, {
      name: 'moduleKeywords',
      message: 'keywords:',
    }];

    this.prompt(R.concat(
      R.concat(personPrompts, prefPrompts),
      pkgPrompts
    ), function (props) {
      var tpl = {
        moduleName: props.moduleName,
        moduleDesc: props.moduleDesc,
        moduleKeywords: splitKeywords(props.moduleKeywords),
        moduleVersion: props.moduleVersion,
        moduleLicense: props.moduleLicense,
        camelModuleName: camelize(props.moduleName),
        githubUsername: props.githubUsername,
        name: props.name,
        email: props.email,
        website: props.website,
        humanizedWebsite: humanizeUrl(props.website),
      };

      var cpTpl = function (from, to) {
        this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), tpl);
      }.bind(this);

      cpTpl('_index.js', 'index.js');
      cpTpl('_package.json', 'package.json');
      cpTpl('_README.md', 'README.md');
      cpTpl('_test.js', 'test.js');
      cpTpl('editorconfig', '.editorconfig');
      cpTpl('gitignore', '.gitignore');
      cpTpl('npmignore', '.npmignore');

      cb();
    }.bind(this));
  },
  writing: function () {
    [
      { travis: { config: { after_script: ['npm run coveralls'] } } },
      { babel: { config: { plugins: ['add-module-exports'] } } },
      { 'eslint-init': { config: { extends: 'airbnb/base', plugins: ['require-path-exists'] } } },
      'git-init',
    ].forEach(function (input) {
      this.composeWith(
        name(input),
        { options: R.merge(options(input), { 'skip-install': this.options['skip-install'] }) },
        { local: require.resolve('generator-' + name(input) + '/generators/app') }
      );
    }.bind(this));
  },
  install: function () {
    this.installDependencies({ bower: false });
  },
});
