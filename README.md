# ManDoc

[![NPM version](https://badge.fury.io/js/mandoc.svg)](http://badge.fury.io/js/mandoc)
[![dependencies Status](https://david-dm.org/chigix/mandoc/status.svg)](https://david-dm.org/chigix/mandoc)
[![devDependencies Status](https://david-dm.org/chigix/mandoc/dev-status.svg)](https://david-dm.org/chigix/mandoc?type=dev)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

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

## TODO

* `print.margin` option support
* Separate types package outside src, preparing for the future migration and
  typescript support in Template Script Files.
* Support YAML-Formatted Metadata Parsing
  * https://blog.github.com/2013-09-27-viewing-yaml-metadata-in-your-documents/
  * https://jekyllrb.com/docs/front-matter/
* Support curly-bracket wrapped directive:
  https://github.com/angular/angular/commit/1847550ad17ddd4a20d02b8a96f718e632ab27d1#diff-8aadef410e1b120ea8201253373fe1e5R2912

## To Try

* tsconfig file series practice
  It seems that `esm5` and `esm2015` compiling result from typescript source
  code could be directly used for the keys, [`module`](https://github.com/rollup/rollup/wiki/pkg.module)
  and `es2015`,  in `package.json` file.

  This practice could also be totally referenced in `rxjs` official repository,
  where different tsconfig files are prepared for compiling target as `es5` and
  `es2015`.

  This attempt sounds that a little time would be cost without any apparent technical
  barrier that need to spend time for inspecting and learning.
* RXJS commit message guideline
  https://github.com/ReactiveX/rxjs/blob/master/CONTRIBUTING.md#commit-message-guidelines
* Default Slide Template Support Plan

## License

MIT
