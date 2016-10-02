'use strict';
/* eslint-disable func-names, vars-on-top, no-underscore-dangle */

var yeoman = require('yeoman-generator');
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
var storedYoDefaults = require('stored-yo-defaults');
var depsObject = require('deps-object');
var sortedObject = require('sorted-object');
var testFrameworksHash = require('./test-frameworks');

// name :: String | Object -> String
var name = R.ifElse(R.is(String), R.identity, R.pipe(R.keys, R.head));

// options :: String | Object -> Object
var options = R.ifElse(R.is(String), R.always({}), R.pipe(R.values, R.head));

// rejectNil :: Object -> Object
var rejectNil = R.reject(R.isNil);

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);
    this.argument('name', { type: String, required: false,
      desc: ([
        'Node module’s name: "$ yo zen pify";',
        'node module will be initialized in created folder',
        'and you will be redirected to that folder'
      ].join('\n\t') + '\n    ')
    });
    this.option('all', { type: Boolean, required: false, alias: 'a', defaults: false,
      desc: 'Ask all questions'
    });
    this.option('skip', { type: Boolean, required: false, alias: 's', defaults: false,
      desc: 'Ask minimum questions, like `$ npm init --yes/--force` '
    });
    this.option('yes', { type: Boolean, required: false, alias: 'y', defaults: false,
      desc: 'Same as `--skip`'
    });
    this.option('force', { type: Boolean, required: false, alias: 'f', defaults: false,
      desc: 'Same as `--skip`'
    });
    this.option('perfomant', { type: Boolean, required: false, alias: 'p', defaults: false,
      desc: 'Perfomant install, ensure you have pnpm installed globally (`$ npm i -g pnpm`)'
    });
    this.option('debug', { type: Boolean, required: false, alias: 'd', defaults: false,
      desc: 'Debug mode'
    });
    this.option('commit', { type: String, required: false, alias: 'c',
      desc: 'Commit message, optional'
    });

    // helpers
    this.saveDepsToPkg = function (deps) {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
      var currentDeps = pkg.devDependencies || {};
      var mergedDeps = R.merge(currentDeps, deps);
      var sortedDeps = sortedObject(mergedDeps);
      pkg.devDependencies = sortedDeps;
      this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    };

    this.commitMessage = function commitMessage() {
      if (this.options.commit) {
        return this.options.commit;
      }
      var commitsRaw = spawnSync('git', ['log', '--oneline']).stdout.toString();
      var commits = commitsRaw.split('\n').filter(Boolean);
      return '☯ zen ' + (R.isEmpty(commits) ? 'init' : 'update');
    };
  },
  initializing: function () {
    this.firstTime = !this._globalConfig.getAll().promptValues;
    this.savedAnswers = this._globalConfig.getAll().promptValues || {};
    this.shouldAskAll = !!(this.options.all || this.options.a);
    this.shouldSkipAll = !!(this.options.skip || this.options.force || this.options.yes);
    this.testFrameworksKeys = R.keys(testFrameworksHash);

    if (this.options.debug) {
      this.log('ARGUMENT: name ' + this.name);
      this.log('OPTIONS:');
      this.log(R.pickAll(['all', 'skip', 'yes', 'perfomant', 'debug', 'commit'], this.options));
      this.log('shouldAskAll: ' + this.shouldAskAll);
      this.log('shouldSkipAll: ' + this.shouldSkipAll);
    }

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
      when: shouldAskPersonPrompts('name')
    }, {
      name: 'email',
      message: '☯ your email:',
      store: true,
      validate: ifEmpty('You have to provide email'),
      when: shouldAskPersonPrompts('email')
    }, {
      name: 'website',
      message: '☯ your website:',
      store: true,
      validate: ifEmpty('You have to provide website'),
      filter: normalizeUrl,
      when: shouldAskPersonPrompts('website')
    }, {
      name: 'githubUsername',
      message: '☯ your github username:',
      store: true,
      validate: ifEmpty('You have to provide a username'),
      when: shouldAskPersonPrompts('githubUsername')
    }, {
      name: 'appveyorSupport',
      message: '☯ appveyor CI:',
      type: 'confirm',
      default: true,
      store: true,
      when: shouldAskPrefPrompts
    }, {
      name: 'moduleVersion',
      message: '☯ preferred version to start:',
      store: true,
      default: '0.0.0',
      when: shouldAskPrefPrompts
    }, {
      name: 'moduleLicense',
      message: '☯ preferred license:',
      store: true,
      default: 'MIT',
      when: shouldAskPrefPrompts
    }, {
      name: 'moduleTest',
      message: '☯ preferred test framework:',
      type: 'list',
      choices: this.testFrameworksKeys,
      store: true,
      default: 1,
      when: shouldAskPrefPrompts
    }, {
      name: 'moduleName',
      message: '☯ name:',
      default: slugify(this.name || this.appname),
      filter: slugify,
      when: !this.shouldSkipAll
    }, {
      name: 'moduleDesc',
      message: '☯ description:',
      when: !this.shouldSkipAll
    }, {
      name: 'moduleKeywords',
      message: '☯ keywords:',
      filter: splitKeywords,
      when: !this.shouldSkipAll
    }];

    this.prompt(questions, function (inputAnswers) {
      this.props = R.mergeAll([
        storedYoDefaults(questions), // Default values will be overrided by saved ones
        this.savedAnswers,           // Saved values will be overrided by user input
        { moduleName: this.name },   // argument name will be used only if user input skipped
        rejectNil(inputAnswers)
      ]);
      this.testFramework = R.prop(this.props.moduleTest, testFrameworksHash);

      if (this.options.debug) {
        this.log('\nANSWERS:');
        this.log('STORED:');
        this.log(storedYoDefaults(questions));
        this.log('SAVED:');
        this.log(this.savedAnswers);
        this.log('INPUT:');
        this.log(inputAnswers);
        this.log('\nRESULT:');
        this.log(this.props);
      }

      if (!this.testFramework) {
        throw new Error('Unexpected test framework: ' + this.props.moduleTest);
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
      appveyorSupport: this.props.appveyorSupport,
      camelModuleName: camelize(this.props.moduleName),
      githubUsername: this.props.githubUsername,
      name: this.props.name,
      email: this.props.email,
      website: this.props.website,
      npmTestString: this.testFramework.test,
      npmTddString: this.testFramework.tdd
    };

    var cpTpl = function (from, to) {
      this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), tpl);
    }.bind(this);

    cpTpl('_index.js', 'index.js');
    cpTpl('_package.json', 'package.json');
    cpTpl('_README.md', 'README.md');
    cpTpl('editorconfig', '.editorconfig');
    cpTpl('gitignore', '.gitignore');
    cpTpl('CHANGELOG.md', 'CHANGELOG.md');

    cpTpl('_test-' + this.props.moduleTest + '.js', 'test.js');

    if (this.props.appveyorSupport) {
      cpTpl('appveyor.yml', 'appveyor.yml');
    }

    return depsObject(this.testFramework.deps)
      .then(function (devDeps) {
        this.saveDepsToPkg(devDeps);

        [
          { travis: { config: { after_script: ['npm run coveralls'] } } },
          { babel: { config: { plugins: ['add-module-exports'] } } },
          { 'eslint-init': { config: this.testFramework.eslint } },
          { 'git-init': { commit: this.commitMessage() } }
        ].forEach(function (input) {
          this.composeWith(
            name(input),
            { options: R.merge(options(input), {
              'skip-install': this.options.perfomant
              ? true
              : this.options['skip-install']
            }) },
            { local: require.resolve('generator-' + name(input)) }
          );
        }.bind(this));
      }.bind(this))
      .catch(function (err) { throw err; });
  },
  install: function () {
    if (!this.options['skip-install']) {
      if (this.options.perfomant) {
        this.spawnCommandSync('pnpm', ['install']);
      } else {
        this.npmInstall();
      }
    }
  }
});
