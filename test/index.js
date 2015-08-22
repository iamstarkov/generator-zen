var path = require("path")
var assert = require("yeoman-generator").assert
var helpers = require("yeoman-generator").test

describe("generator-tiny-es-nm:app", function () {
  before(function (done) {
    helpers.run(path.join(__dirname, "../app"))
      .withOptions({ skipInstall: true })
      .withPrompts({ someOption: true })
      .on("end", done)
  })

  it("creates files", function () {
    assert.file([
      '.editorconfig',
      '.gitignore',
      '.eslintrc',
      '.npmignore',
      '.travis.yml',
      'package.json',
      'src/index.js',
      'test/index.js',
      'README.md',
      'CHANGELOG.md'
    ])
  })
})

/*
"use strict"

var path = require("path")
var assert = require("yeoman-generator").assert
var helpers = require("yeoman-generator").test

describe("generator fly plugin:app", function () {
  before(function (done) {
    helpers.run(path.join(__dirname, "../generators/app"))
      .withOptions({ skipInstall: true })
      .withPrompts({ someOption: true })
      .on("end", done)
  })

  it("creates files", function () {
    assert.file([
      "CHANGELOG.md",
      "index.js",
      ".travis.yml",
      ".editorconfig",
      "README.md",
      "package.json",
      ".editorconfig",
      ".eslintrc",
      "LICENSE",
      ".gitignore",
      "test/test.js"
    ])
  })
})
*/
