var slugify = require('underscore.string').slugify;

function getPkgPrompts(name) {
  return [{
    name: 'moduleName',
    message: '☯ name:',
    default: name.replace(/\s/g, '-'),
    filter: slugify,
  }, {
    name: 'moduleDesc',
    message: '☯ description:',
  }, {
    name: 'moduleKeywords',
    message: '☯ keywords:',
  }];
}

module.exports = getPkgPrompts;
