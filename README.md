# ManDoc

[![NPM version](https://badge.fury.io/js/mandoc.svg)](http://badge.fury.io/js/mandoc)
[![dependencies Status](https://david-dm.org/chigix/mandoc/status.svg)](https://david-dm.org/chigix/mandoc)
[![devDependencies Status](https://david-dm.org/chigix/mandoc/dev-status.svg)](https://david-dm.org/chigix/mandoc?type=dev)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

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
