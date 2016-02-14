# generator-zen

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][depstat-image]][depstat-url]

> ☯ zen node module scaffolder

* `npm init` compliant
* ES6 workflow
* Structured and trustworthy README
* Tests, tdd and test coverage
* [Ready to use with travis and coveralls](#next-steps)
* ![Badges][badges]

[tdd]: https://iamstarkov.com/start-with-testing/
[badges]: https://img.shields.io/badge/with-badges-brightgreen.svg?style=flat-square

## Install

    npm install --global yo generator-zen

## Usage

Initially `zen` asks all questions, but its only first time.  
`zen` doesn't bother you with questions about your and your preferences twice.  
`zen` asks necessary questions about your project (name, description and keywords).

    yo zen

`zen` even creates folder for you, just give a name as an argument

    yo zen meow

Efficient `zen` asks zero questions with `--yes/-y` flags:

    yo zen meow -y

Although, zen can ask `--all/a` questions. Useful if you need to change previous answers:

    yo zen -a

Ask about help you forgot something:

    yo zen -h

### Next steps:

1. Push it to your github repo
2. Enable your project on travis: https://travis-ci.org/profile/
3. Enable your project on coveralls: https://coveralls.io/repos/new
4. Write some tests in tests.js
5. Run tdd mode: `npm run tdd`
6. Write your module to pass the tests
7. When all tests are green bump major version and publish it:
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
[travis-image]: https://img.shields.io/travis/iamstarkov/generator-zen.svg?style=flat-square

[depstat-url]: https://david-dm.org/iamstarkov/generator-zen
[depstat-image]: https://david-dm.org/iamstarkov/generator-zen.svg?style=flat-square
