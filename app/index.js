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

// name :: String | Object -> String
var name = R.ifElse(R.is(String), R.identity, R.pipe(R.keys, R.head));

// options :: String | Object -> Object
var options = R.ifElse(R.is(String), R.always({}), R.pipe(R.values, R.head));

// rejectNil :: Object -> Object
var rejectNil = R.reject(R.isNil);

function getNpmTestString(framework) {
  switch (framework) {
    case 'mocha': return 'mocha --require babel-register';
    case 'tape': return 'tape test.js --require babel-register | tap-spec';
    case 'ava': return 'ava --require babel-register';
    default: throw new Error('Unexpected test frameworl: ' + framework);
  }
}

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
    this.savedProps = this._globalConfig.getAll().promptValues || {};
    this.shouldAskAll = !!(this.options.all || this.options.a);
    this.shouldSkipAll = !!(this.options.skip || this.options.force || this.options.yes);

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
    var self = this;
    var cb = this.async();
    var shouldAskPersonPrompts = function (prop) {
      return R.or(
        R.pipe(R.prop(prop), R.isNil)(self.savedProps),
        R.identity(self.shouldAskAll)
      );
    };
    var shouldAskPrefPrompts = R.or(self.firstTime, self.shouldAskAll);

    var prompts = [{
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
      choices: ['mocha', 'tape', 'ava'],
      store: true,
      default: 1,
      when: shouldAskPrefPrompts,
    }, {
      name: 'moduleName',
      message: '☯ name:',
      default: this.appname.replace(/\s/g, '-'),
      filter: slugify,
    }, {
      name: 'moduleDesc',
      message: '☯ description:',
    }, {
      name: 'moduleKeywords',
      message: '☯ keywords:',
      filter: splitKeywords,
    }];

    this.prompt(prompts, function (inputProps) {
      var props = R.mergeAll([this.savedProps, storedDefaults(prompts), rejectNil(inputProps)]);
      if (this.shouldSkipAll) {
        this.conflicter.force = true;
      }

      var moduleName = props.moduleName;
      if (!moduleName) {
        moduleName = this.name ? this.name : this.appname.replace(/\s/g, '-');
      }

      var tpl = {
        moduleName: props.moduleName,
        moduleDesc: (props.moduleDesc || ('My ' + superb() + ' module')),
        moduleKeywords: (props.moduleKeywords || []),
        moduleVersion: props.moduleVersion,
        moduleLicense: props.moduleLicense,
        moduleTest: props.moduleTest,
        camelModuleName: camelize(moduleName),
        githubUsername: props.githubUsername,
        name: props.name,
        email: props.email,
        website: props.website,
        humanizedWebsite: humanizeUrl(props.website),
        npmTestString: getNpmTestString(props.moduleTest),
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
