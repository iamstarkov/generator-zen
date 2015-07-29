# generator-tiny-es-nm

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]

> Scaffold out a tiny ES6 node module

Features:

* ES6 workflow with prepublish script
* Trustworthy README with Install, Usage, Api and License sections
* [Easy testability, `tdd` mode][tdd] and test coverage
* [Ready to use with travis and coveralls](#next-steps)
* Support for package.json’s fields, your github username too
* Memorizing fields: your name, email, website and github username and license
* And obviously ![Badges][badges] for npm, tests, coverage and dependencies

[tdd]: https://iamstarkov.com/start-with-testing/
[badges]: https://img.shields.io/badge/with-badges-brightgreen.svg?style=flat-square

![soylent example](http://i.imgur.com/10C4sIn.png)

## Install

    npm install --global yo generator-tiny-es-nm

## Usage

    # create folder for your project
    mkdir awsm-project
    cd awsm-project

    # run generator
    yo tiny-es-nm

    # make initial commit
    git init
    git commit -am 'init commit'


### Next steps:

1. Push it to your github repo
2. Enable your project on travis: https://travis-ci.org/profile/
  ![travis](http://i.imgur.com/mN4EvhC.png)
3. Enable your project on coveralls: https://coveralls.io/repos/new
  ![coveralls](http://i.imgur.com/ApfXMLl.png)
4. Write some tests in tests.js
5. Run tdd mode: `npm run tdd`
6. Write your module to pass the tests
7. When all tests are green bump major version and publish it:
  ```js
  npm version major
  npm publish
  ```
  Your package will be tagged, commited, transpiled, published, cleaned up and pushed all the changes to github automagically ✨, take a look at scripts section.
8. You are awesome! ✨💫

## License

MIT © [Vladimir Starkov](https://iamstarkov.com/)

[npm-url]: https://npmjs.org/package/generator-tiny-es-nm
[npm-image]: https://img.shields.io/npm/v/generator-tiny-es-nm.svg?style=flat-square

[travis-url]: https://travis-ci.org/iamstarkov/generator-tiny-es-nm
[travis-image]: https://img.shields.io/travis/iamstarkov/generator-tiny-es-nm.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/iamstarkov/generator-tiny-es-nm
[coveralls-image]: https://img.shields.io/coveralls/iamstarkov/generator-tiny-es-nm.svg?style=flat-square

[depstat-url]: https://david-dm.org/iamstarkov/generator-tiny-es-nm
[depstat-image]: https://david-dm.org/iamstarkov/generator-tiny-es-nm.svg?style=flat-square
