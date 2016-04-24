# <%= moduleName %>

[![NPM version][npm-image]][npm-url]
<% if (!appveyorSupport) { %>[![Build Status][travis-image]][travis-url]<% } else { %>[![Unix Build Status][travis-image]][travis-url]
[![Windows Build Status][appveyor-image]][appveyor-url]<% } %>
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
[travis-image]: https://img.shields.io/travis/<%= githubUsername %>/<%= moduleName %>.svg?style=flat-square<% if (appveyorSupport) { %>&label=unix<% } %>

<% if (appveyorSupport) { %>[appveyor-url]: https://ci.appveyor.com/project/<%= githubUsername %>/<%= moduleName %>
[appveyor-image]: https://img.shields.io/appveyor/ci/<%= githubUsername %>/<%= moduleName %>.svg?style=flat-square&label=windows

<% } %>[coveralls-url]: https://coveralls.io/r/<%= githubUsername %>/<%= moduleName %>
[coveralls-image]: https://img.shields.io/coveralls/<%= githubUsername %>/<%= moduleName %>.svg?style=flat-square

[depstat-url]: https://david-dm.org/<%= githubUsername %>/<%= moduleName %>
[depstat-image]: https://david-dm.org/<%= githubUsername %>/<%= moduleName %>.svg?style=flat-square
