'use strict';
/* eslint-disable func-names, vars-on-top */

var yeoman = require('yeoman-generator');
var humanizeUrl = require('humanize-url');
var camelize = require('underscore.string').camelize;
var R = require('ramda');
var cat = require('./cat');
var superb = require('superb');
var mkdirp = require('mkdirp');
var spawnSync = require('spawn-sync');
var getPersonPrompts = require('./person-prompts');
var getPrefPropmts = require('./pref-prompts');
var getPkgPrompts = require('./pkg-prompts');
var splitKeywords = require('split-keywords');

// concatAll :: [Array*…] -> Array
var concatAll = R.unapply(R.flatten);

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
        'and you will be redirected to that folder',
      ].join('\n\t') + '\n    '),
    });
    this.option('all', { type: Boolean, required: false, alias: 'a', defaults: false,
      desc: 'Ask all questions',
    });
    this.option('skip', { type: Boolean, required: false, alias: 's', defaults: false,
      desc: 'Ask minimum questions, like `$ npm init --yes/--force` ',
    });
    this.option('yes', { type: Boolean, required: false, alias: 'y', defaults: false,
      desc: 'Same as `--skip`',
    });
    this.option('force', { type: Boolean, required: false, alias: 'f', defaults: false,
      desc: 'Same as `--skip`',
    });
    this.option('commit', { type: String, required: false, alias: 'c',
      desc: 'Commit message, optional',
    });
    this.option('perfomant', { type: Boolean, required: false, alias: 'p',
      desc: 'Perfomant install, ensure you have pnpm installed globally (`$ npm i -g pnpm`)',
    });
  },
  initializing: function () {
    this.firstTime = !this._globalConfig.getAll().promptValues;
    this.savedPrompts = this._globalConfig.getAll().promptValues || {};
    this.shouldAskAll = this.options.all || this.options.a;
    this.shouldSkipAll = this.options.skip || this.options.force || this.options.yes;

    if (this.name) {
      mkdirp(this.name);
      this.destinationRoot(this.destinationPath(this.name));
    }

    if (this.shouldAskAll && this.shouldSkipAll) {
      this.log(cat);
      return;
    }
  },
  prompting: function () {
    var cb = this.async();
    var personPrompts = getPersonPrompts();
    var prefPrompts = (!this.firstTime && !this.shouldAskAll) ? [] : getPrefPropmts();
    var pkgPrompts = getPkgPrompts(this.appname);

    if (this.name) {
      pkgPrompts = R.filter(R.pipe(R.propEq('name', 'moduleName'), R.not), pkgPrompts);
    }

    var allPrompts = concatAll(personPrompts, prefPrompts, pkgPrompts);
    var promptsToAsk = getUnsavedPrompts(this.savedPrompts, allPrompts);

    if (this.shouldAskAll) {
      promptsToAsk = allPrompts;
    }

    if (this.shouldSkipAll) {
      promptsToAsk = getUnsavedPrompts(this.savedPrompts, personPrompts);
    }

    this.prompt(promptsToAsk, function (inputProps) {
      var props = R.merge(inputProps, this.savedPrompts);

      if (this.shouldAskAll) {
        props = inputProps;
      }
      if (this.shouldSkipAll) {
        props = R.merge(inputProps, this.savedPrompts);
        this.conflicter.force = true;
      }

      var moduleName = props.moduleName;
      if (!moduleName) {
        moduleName = this.name ? this.name : this.appname.replace(/\s/g, '-');
      }

      var tpl = {
        moduleName: moduleName,
        moduleDesc: this.shouldSkipAll ? 'My ' + superb() + ' module' : props.moduleDesc,
        moduleKeywords: splitKeywords(props.moduleKeywords),
        moduleVersion: (props.moduleVersion || getPrefPropmts()[0].default),
        moduleLicense: (props.moduleLicense || getPrefPropmts()[1].default),
        moduleTest: (props.moduleTest || getPrefPropmts().choices[getPrefPropmts()[2].default]),
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
      cpTpl('editorconfig', '.editorconfig');
      cpTpl('gitignore', '.gitignore');

      switch (tpl.moduleTest) {
        case 'mocha': cpTpl('_test-mocha.js', 'test.js'); break;
        case 'tape': cpTpl('_test-tape.js', 'test.js'); break;
        case 'ava': cpTpl('_test-ava.js', 'test.js'); break;
        default: throw new Error('Unexpected test frameworl: ' + tpl.moduleTest);
      }


      cb();
    }.bind(this));
  },
  writing: function () {
    var commitsRaw = spawnSync('git', ['log', '--oneline']).stdout.toString();
    var commits = commitsRaw.split('\n').filter(Boolean);
    var commitMessage = '☯ zen ' + (R.isEmpty(commits) ? 'init' : 'update');

    [
      { travis: { config: { after_script: ['npm run coveralls'] } } },
      { babel: { config: { plugins: ['add-module-exports'] } } },
      { 'eslint-init': { config: { extends: 'airbnb/base', plugins: ['require-path-exists'] } } },
      { 'git-init': { commit: this.options.commit ? this.options.commit : commitMessage } },
    ].forEach(function (input) {
      this.composeWith(
        name(input),
        { options: R.merge(options(input), { 'skip-install': this.options.perfomant ? true : this.options['skip-install'] }) },
        { local: require.resolve('generator-' + name(input)) }
      );
    }.bind(this));
  },
  install: function () {
    if (!this.options['skip-install']) {
      if (this.options.perfomant) {
        this.spawnCommandSync('pnpm', ['install']);
      } else {
        this.npmInstall();
      }
    }
  },
});
