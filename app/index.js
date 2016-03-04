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
var splitKeywords = require('split-keywords');
var normalizeUrl = require('normalize-url');
var ifEmpty = require('if-empty');
var slugify = require('underscore.string').slugify;
var storedDefaults = require('./stored-defaults').storedDefaults;
var sortedObject = require('sorted-object');

// name :: String | Object -> String
var name = R.ifElse(R.is(String), R.identity, R.pipe(R.keys, R.head));

// options :: String | Object -> Object
var options = R.ifElse(R.is(String), R.always({}), R.pipe(R.values, R.head));

// rejectNil :: Object -> Object
var rejectNil = R.reject(R.isNil);

// depName :: String -> String
var depName = R.pipe(R.split('@'), R.head);

// depVersion :: String -> String
var depVersion = R.pipe(R.split('@'), R.last);

var npmTestStrings = {
  mocha: 'mocha --require babel-register',
  tape: 'tape test.js --require babel-register | tap-spec',
  ava: 'ava --require babel-register',
};

var testDevDeps = {
  mocha: ['assert@^1.3.0', 'mocha@^2.4.5'],
  tape: ['tap-spec@^4.1.1', 'tape@^4.4.0'],
  ava: ['ava@^0.12.0'],
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
    this.savedAnswers = this._globalConfig.getAll().promptValues || {};
    this.shouldAskAll = !!(this.options.all || this.options.a);
    this.shouldSkipAll = !!(this.options.skip || this.options.force || this.options.yes);
    this.testFrameworks = ['mocha', 'tape', 'ava'];

    if (this.shouldAskAll && this.shouldSkipAll) {
      this.log(cat);
      return;
    }
  },
  prompting: function () {
    var self = this;
    var cb = this.async();
    var shouldAskPersonPrompts = function (prop) {
      return R.or(
        R.pipe(R.prop(prop), R.isNil)(self.savedAnswers),
        R.identity(self.shouldAskAll)
      );
    };
    var shouldAskPrefPrompts = R.or(self.firstTime, self.shouldAskAll);

    var questions = [{
      name: 'name',
      message: '☯ your name:',
      store: true,
      validate: ifEmpty('You have to provide name'),
      when: shouldAskPersonPrompts('name'),
    }, {
      name: 'email',
      message: '☯ your email:',
      store: true,
      validate: ifEmpty('You have to provide email'),
      when: shouldAskPersonPrompts('email'),
    }, {
      name: 'website',
      message: '☯ your website:',
      store: true,
      validate: ifEmpty('You have to provide website'),
      filter: normalizeUrl,
      when: shouldAskPersonPrompts('website'),
    }, {
      name: 'githubUsername',
      message: '☯ your github username:',
      store: true,
      validate: ifEmpty('You have to provide a username'),
      when: shouldAskPersonPrompts('githubUsername'),
    }, {
      name: 'moduleVersion',
      message: '☯ preferred version to start:',
      store: true,
      default: '0.0.0',
      when: shouldAskPrefPrompts,
    }, {
      name: 'moduleLicense',
      message: '☯ preferred license:',
      store: true,
      default: 'MIT',
      when: shouldAskPrefPrompts,
    }, {
      name: 'moduleTest',
      message: '☯ preferred test framework:',
      type: 'list',
      choices: this.testFrameworks,
      store: true,
      default: 1,
      when: shouldAskPrefPrompts,
    }, {
      name: 'moduleName',
      message: '☯ name:',
      default: slugify(this.name || this.appname),
      filter: slugify,
    }, {
      name: 'moduleDesc',
      message: '☯ description:',
    }, {
      name: 'moduleKeywords',
      message: '☯ keywords:',
      filter: splitKeywords,
    }];

    this.prompt(questions, function (inputAnswers) {
      this.props = R.mergeAll([
        storedDefaults(questions), // Default values will be overrided by saved ones
        this.savedAnswers,         // Saved values will be overrided by user input
        rejectNil(inputAnswers),
      ]);

      if (R.not(R.contains(this.props.moduleTest, this.testFrameworks))) {
        throw new Error('Unexpected test frameworl: ' + this.props.moduleTest);
      }

      if (this.shouldSkipAll) {
        this.conflicter.force = true;
      }

      cb();
    }.bind(this));
  },
  writing: function () {
    if (this.name) {
      mkdirp(this.props.moduleName);
      this.destinationRoot(this.destinationPath(this.props.moduleName));
    }

    var tpl = {
      moduleName: this.props.moduleName,
      moduleDesc: this.shouldSkipAll ? ('My ' + superb() + ' module') : this.props.moduleDesc,
      moduleKeywords: (this.props.moduleKeywords || []),
      moduleVersion: this.props.moduleVersion,
      moduleLicense: this.props.moduleLicense,
      moduleTest: this.props.moduleTest,
      camelModuleName: camelize(this.props.moduleName),
      githubUsername: this.props.githubUsername,
      name: this.props.name,
      email: this.props.email,
      website: this.props.website,
      humanizedWebsite: humanizeUrl(this.props.website),
      npmTestString: R.prop(this.props.moduleTest, npmTestStrings),
    };

    var cpTpl = function (from, to) {
      this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), tpl);
    }.bind(this);

    cpTpl('_index.js', 'index.js');
    cpTpl('_package.json', 'package.json');
    cpTpl('_README.md', 'README.md');
    cpTpl('editorconfig', '.editorconfig');
    cpTpl('gitignore', '.gitignore');
    cpTpl('gitignore', '.gitignore');
    cpTpl('_test-' + this.props.moduleTest + '.js', 'test.js');

    var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    var devDeps = R.prop(this.props.moduleTest, testDevDeps).reduce(function (state, dep) {
      return R.merge(state, R.zipObj([depName(dep)], [depVersion(dep)]));
    }, {});
    pkg.devDependencies = sortedObject(R.merge((pkg.devDependencies || {}), devDeps));
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

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
        { options: R.merge(options(input), {
          'skip-install': this.options.perfomant
                ? true
                : this.options['skip-install'],
        }) },
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
