# generator-zen

[![Greenkeeper badge](https://badges.greenkeeper.io/iamstarkov/generator-zen.svg)](https://greenkeeper.io/)

[![NPM version][npm-image]][npm-url]
[![Unix Build Status][travis-image]][travis-url]
[![Windows Build Status][appveyor-image]][appveyor-url]
[![Dependency Status][depstat-image]][depstat-url]

> ☯ zen node module scaffolder

**News:** Now supports [mocha][m], [tape][t] or [ava][a] as test frameworks to choose from.

[m]: https://github.com/mochajs/mocha
[t]: https://github.com/substack/tape
[a]: https://github.com/sindresorhus/ava

## Install

    npm install --global yo generator-zen

## Usage

    yo zen

_I designed `zen` to ask only essential questions_, so questions about
you and and your preferences are remembered by zen on initial run.
Afterwards `zen` asks questions about each module in particular.

Also you can can `--skip/-s` all questions or force `zen` to ask `--all/-a` questions.

Speed up dependencies installing with `--perfomant/-p` option, it uses `pnpm`, so ensure you have pnpm installed globally (`$ npm i -g pnpm`).

    $ yo zen -h
    Usage:
      yo zen [<name>] [options]

    Options:
      -h,   --help          # Print the generator's options and usage
            --skip-cache    # Do not remember prompt answers                                                                     Default: false
            --skip-install  # Do not automatically install dependencies                                                          Default: false
      -a,   --all           # Ask all questions                                                                                  Default: false
      -s,   --skip          # Ask minimum questions, like `$ npm init --yes/--force`                                             Default: false
      -y,   --yes           # Same as `--skip`                                                                                   Default: false
      -f,   --force         # Same as `--skip`                                                                                   Default: false
      -p,   --perfomant     # Perfomant install, so ensure you have pnpm installed globally (`$ npm i -g pnpm`)                  Default: false
      -d,   --debug         # Debug mode                                                                                         Default: false
      -c,   --commit        # Commit message

    Arguments:
      name  # Node module’s name: "$ yo zen pify";
            node module will be initialized in created folder
            and you will be redirected to that folder
          Type: String  Required: false

[pnpm]: https://github.com/rstacruz/pnpm

## Next steps:

1. Push it to your github repo
2. Enable your project on travis: https://travis-ci.org/profile/
3. Enable your project on coveralls: https://coveralls.io/repos/new
4. Enable your project on appveyor: https://ci.appveyor.com/projects/new
5. Write some tests in tests.js
6. Run tdd mode: `npm run tdd`
7. Write your module to pass the tests
8. When all tests are green bump major version and publish it:
  ```
  npm version major
  npm publish
  ```
  Your package will be tagged, commited, transpiled, published, cleaned up and pushed all the changes to github automagically ✨, take a look at scripts section.

You are awesome! ✨💫

## License

MIT © [Vladimir Starkov](https://iamstarkov.com/)

[npm-url]: https://npmjs.org/package/generator-zen
[npm-image]: https://img.shields.io/npm/v/generator-zen.svg?style=flat-square

[travis-url]: https://travis-ci.org/iamstarkov/generator-zen
[travis-image]: https://img.shields.io/travis/iamstarkov/generator-zen.svg?style=flat-square&label=unix

[appveyor-url]: https://ci.appveyor.com/project/iamstarkov/generator-zen
[appveyor-image]: https://img.shields.io/appveyor/ci/iamstarkov/generator-zen.svg?style=flat-square&label=windows

[depstat-url]: https://david-dm.org/iamstarkov/generator-zen
[depstat-image]: https://david-dm.org/iamstarkov/generator-zen.svg?style=flat-square
