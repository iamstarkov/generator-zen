const yeoman = require('yeoman-generator');
const normalizeUrl = require('normalize-url');
const humanizeUrl = require('humanize-url');
const _s = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
  init: function () {
    const done = this.async()

    this.prompt([
    {
      name: 'moduleName',
      message: 'name:',
      default: this.appname.replace(/\s/g, '-'),
      filter: function (val) {
        return _s.slugify(val)
      }
    },
    {
      name: 'moduleDesc',
      message: 'description:'
    },
    {
      name: 'moduleKeywords',
      message: 'keywords:'
    },
    {
      name: 'moduleVersion',
      message: 'version:',
      store: true,
      default: '0.0.0',
    },
    {
      name: 'moduleLicense',
      message: 'license:',
      store: true,
      default: 'MIT',
    },
    {
      name: 'githubUsername',
      message: 'github username:',
      store: true,
      validate: function (val) {
        return val.length > 0 ? true : 'You have to provide a username'
      }
    },
    {
      type: "confirm",
      name: "changelog",
      message: "changelog:",
      store: true,
      default: true
    },
    {
      name: 'website',
      message: 'website:',
      store: true,
      default: function (props) {
        return "http://github.com/" + props.githubUsername
      },
      filter: function (val) {
        return normalizeUrl(val)
      }
    }],
    function (props) {
      this.moduleName = props.moduleName
      this.moduleDesc = props.moduleDesc
      this.moduleVersion = props.moduleVersion
      this.moduleLicense = props.moduleLicense
      this.camelModuleName = _s.camelize(props.moduleName)
      this.githubUsername = props.githubUsername
      this.name = this.user.git.name()
      this.email = this.user.git.email()
      this.website = props.website
      this.humanizedWebsite = humanizeUrl(props.website)
      this.moduleKeywords = (props.moduleKeywords || '')
        .trim()
        .split(',')
        .map(function(i) {
          return (i || '').trim()
        })
      this.hasChangelog = props.changelog

      this.template('package.json')
      this.template('README.md')
      if (this.hasChangelog) {
        this.template("CHANGELOG.md")
      }
      this.template('index.js',      'src/index.js')
      this.template('test.js',       'test/index.js')
      this.template('editorconfig',  '.editorconfig')
      this.template('gitignore',     '.gitignore')
      this.template('npmignore',     '.npmignore')
      this.template('travis.yml',    '.travis.yml')
      this.template('eslintrc',      '.eslintrc')

      done()
    }.bind(this))
  },
  install: function () {
    this.installDependencies({ bower: false })
  }
})
