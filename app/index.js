'use strict';
/* eslint-disable func-names, vars-on-top */

var yeoman = require('yeoman-generator');
var normalizeUrl = require('normalize-url');
var humanizeUrl = require('humanize-url');
var slugify = require('underscore.string').slugify;
var camelize = require('underscore.string').camelize;
var R = require('ramda');
var cat = require('./cat');
var superb = require('superb');
var mkdirp = require('mkdirp');

// ifEmpty :: String -> String -> true | String
var ifEmpty = R.uncurryN(2, R.pipe(R.always, R.ifElse(R.isEmpty, R.__, R.T)));

// concatAll :: [Array*…] -> Array
var concatAll = R.unapply(R.flatten);

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

// getUnsavedPrompts :: (Object, [Object]) -> Object
var getUnsavedPrompts = function (savedPrompts, allPrompts) {
  var savedKeys = R.keys(savedPrompts);
  var allKeys = R.map(R.prop('name'), allPrompts);
  var getPrompt = R.pipe(R.propEq('name'), R.find(R.__, allPrompts));
  var diffKeys = R.difference(allKeys, savedKeys);
  return R.map(getPrompt, diffKeys);
};

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);
    this.argument('name', { type: String, required: false,
      desc: ([
        'Node module’s name: "$ yo zen pify";',
        'node module will be initialized in created folder',
        'and you will be redicted to that folder',
      ].join('\n\t') + '\n    '),
    });
    this.option('all', { type: Boolean, required: false, alias: 'a', defaults: false,
      desc: 'Ask all questions',
    });
    this.option('yes', { type: Boolean, required: false, alias: 'y', defaults: false,
      desc: 'Ask minimum questions, like `$ npm init --yes` ',
    });
    this.option('force', { type: Boolean, required: false, alias: 'f', defaults: false,
      desc: 'Ask minimum questions, like `$ npm init --force` ',
    });
    this.option('commit', { type: String, required: false, alias: 'c',
      desc: 'Commit message, optional',
    });
  },
  init: function () {
    var cb = this.async();
    var firstTime = !this._globalConfig.getAll().promptValues;
    var savedPrompts = this._globalConfig.getAll().promptValues || {};
    var shouldAskAll = this.options.all || this.options.a;
    var shouldSkipAll = this.options.force || this.options.yes;

    if (this.name) {
      mkdirp(this.name);
      this.destinationRoot(this.destinationPath(this.name));
    }

    if (shouldAskAll && shouldSkipAll) {
      this.log(cat);
      return;
    }

    var personPrompts = [{
      name: 'name',
      message: '☯ your name:',
      store: true,
      validate: ifEmpty('You have to provide name'),
    }, {
      name: 'email',
      message: '☯ your email:',
      store: true,
      validate: ifEmpty('You have to provide email'),
    }, {
      name: 'website',
      message: '☯ your website:',
      store: true,
      validate: ifEmpty('You have to provide website'),
      filter: normalizeUrl,
    }, {
      name: 'githubUsername',
      message: '☯ your github username:',
      store: true,
      validate: ifEmpty('You have to provide a username'),
    }];

    var prefPrompts = (!firstTime && !shouldAskAll) ? [] : [{
      name: 'moduleVersion',
      message: '☯ preferred version to start:',
      store: true,
      default: '0.0.0',
    }, {
      name: 'moduleLicense',
      message: '☯ preferred license:',
      store: true,
      default: 'MIT',
    }];

    var pkgNamePrompts = [{
      name: 'moduleName',
      message: '☯ name:',
      default: this.appname.replace(/\s/g, '-'),
      filter: slugify,
    }];

    var pkgPrompts = [{
      name: 'moduleDesc',
      message: '☯ description:',
    }, {
      name: 'moduleKeywords',
      message: '☯ keywords:',
    }];

    pkgPrompts = this.name ? pkgPrompts : R.concat(pkgNamePrompts, pkgPrompts);

    var allPrompts = concatAll(personPrompts, prefPrompts, pkgPrompts);
    var promptsToAsk = getUnsavedPrompts(savedPrompts, allPrompts);

    if (shouldAskAll) {
      promptsToAsk = allPrompts;
    }

    if (shouldSkipAll) {
      promptsToAsk = getUnsavedPrompts(savedPrompts, personPrompts);
    }

    this.prompt(promptsToAsk, function (inputProps) {
      var props = R.merge(inputProps, savedPrompts);

      if (shouldAskAll) {
        props = inputProps;
      }
      if (shouldSkipAll) {
        props = R.merge(inputProps, savedPrompts);
        this.conflicter.force = true;
      }

      var moduleName = (props.moduleName || (this.name ? this.name : this.appname.replace(/\s/g, '-')));

      var tpl = {
        moduleName: moduleName,
        moduleDesc: shouldSkipAll ? 'My ' + superb() + ' module' : props.moduleDesc,
        moduleKeywords: splitKeywords(props.moduleKeywords),
        moduleVersion: (props.moduleVersion || '0.0.0'),
        moduleLicense: (props.moduleLicense || 'MIT'),
        camelModuleName: camelize(moduleName),
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
      { 'git-init': { commit: this.options.commit ? this.options.commit : '☯ zen init' } },
    ].forEach(function (input) {
      this.composeWith(
        name(input),
        { options: R.merge(options(input), { 'skip-install': this.options['skip-install'] }) },
        { local: require.resolve('generator-' + name(input)) }
      );
    }.bind(this));
  },
  install: function () {
    this.npmInstall();
  },
  end: function () {
    if (this.name) {
      // @TODO change dir to newly created project
    }
  },
});
