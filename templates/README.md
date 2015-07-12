# <%= moduleName %>

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]

> <%= moduleDesc %>

## Install

    npm install --save <%= moduleName %>

## Usage

```js
import <%= camelModuleName %> from '<%= moduleName %>';

<%= camelModuleName %>('unicorns'); // unicorns
```

## API

### <%= camelModuleName %>(input, [options])

#### input

*Required*  
Type: `String`

Lorem ipsum.

#### options

##### foo

Type: `Boolean`  
Default: `false`

Lorem ipsum.

## License

<%= moduleLicense %> © [<%= name %>](<%= website %>)

[npm-url]: https://npmjs.org/package/<%= moduleName %>
[npm-image]: https://img.shields.io/npm/v/<%= moduleName %>.svg?style=flat-square

[travis-url]: https://travis-ci.org/<%= githubUsername %>/<%= moduleName %>
[travis-image]: https://img.shields.io/travis/<%= githubUsername %>/<%= moduleName %>.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/<%= githubUsername %>/<%= moduleName %>
[coveralls-image]: https://img.shields.io/coveralls/<%= githubUsername %>/<%= moduleName %>.svg?style=flat-square

[depstat-url]: https://david-dm.org/<%= githubUsername %>/<%= moduleName %>
[depstat-image]: https://david-dm.org/<%= githubUsername %>/<%= moduleName %>.svg?style=flat-square
