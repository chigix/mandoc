# ManDoc

[![NPM version](https://badge.fury.io/js/mandoc.svg)](http://badge.fury.io/js/mandoc)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

Your swiss-army knife to convert documents in Markdown to PDF or HTML.

## Features

This project is inspired by

* [markdown-pdf](https://github.com/alanshaw/markdown-pdf)
* [pandoc](https://pandoc.org/)
* [DeckTape](https://github.com/astefanutti/decktape)
* [Hexo](https://hexo.io/)

## Installation

```bash
$ npm install mandoc -g
```

Executable Package Release is also in plan for Windows Users.

Docker Image provide is also in plan for Docker Users.

## Quick Start

Convert your markdown into PDF through *Mandoc*

```bash
$ mandoc path/to/your/doc.md
$ open path/to/your/doc.pdf
```

Convert a markdown bytes stream to PDF

```bash
$ curl https://raw.githubusercontent.com/chigix/mandoc/master/README.md | mandoc -o ./r.pdf
```

With Template to build for different situation from your original markdown

```bash
$ mandoc --template path/to/template_dir path/to/your/doc.md
```

Template in mandoc is similar to the concept of theme in building a web site.
However mandoc is designed for converting your original markdown document into
different shape of files for different situation and needs, which is mostly
outputted to a single file as the final result for future usage.

About the template package, mandoc is designed to support npm packaged template
release as well, which means that you can share or download other designers'
template work through `npm install -g tpl_name` simply.

## Format Specific Options

Currently, `html` and `pdf` are supported, and default output format would be
`pdf`.

If you want html format as the output result:

```bash
$ mandoc --to html path/to/your/doc.md
```

## Print Option Section

`--pagesize` *SIZE*, `--print.pageSize` *SIZE*
: Specify the paper size for output pdf file.

  *SIZE* format can be:
    * `A4`
    * `A3 landscape`
    * `400mm 600mm`, where the left dedicates to the width to set and the right is
    height

## Markdown Front-Matter Support

Uses <https://www.npmjs.com/package/remarkable-front-matter>

## TODO

* `print.margin` option support
* Support curly-bracket wrapped directive:
  <https://github.com/angular/angular/commit/1847550ad17ddd4a20d02b8a96f718e632ab27d1#diff-8aadef410e1b120ea8201253373fe1e5R2912>

## License

[MIT](https://github.com/chigix/mandoc/blob/master/LICENSE)
