# remarkable-front-matter

Make Remarkable Extensible Markdown Parser process the file with a
[YAML](https://yaml.org/) front matter block ahead of a markdown file.
This design is inspired by
[Jekyll's Front Matter](https://jekyllrb.com/docs/front-matter/).

Here is a basic example:

```markdown
---
title: ManDoc: Leverage your Reusable Knowledge posted in Markdown.
author:  Richard Lea
---
```

The front matter must take the form of valid YAML set between triple-dashed lines.
Between these triple-dashed lines, you can set
[predefined variables](https://github.com/chigix/mandoc/blob/master/packages/mandoc/src/interfaces.ts#L12)
or even create custom ones of your own.

These variables will then be available to template package to access and render
in any layouts or create some interesting rendering logic for that page or post
, for example in question relies on.

## Installation

```sh-session
$ npm install remarkable-front-matter
```

## Quick Start

Given a sample markdown string started by a YAML meta data surrounded by
triple-dashed lines, `---`, to render, the YAML front-matter could be availabe
through
[remarkable render env](https://github.com/jonschlinkert/remarkable/blob/master/docs/renderer.md),
the key-value store created by parsing rules:

```typescript
import frontMatterPlugin from 'remarkable-front-matter';

// Init Remarkable Renderer Instance with frontMatterPlugin loading.
const md = new Remarkable();
md.use(frontMatterPlugin);

// Prepare an environment mapping object for keeping frontMatter Data later.
const env = {frontMatter: undefined};
md.render([
    '---',
    'title: Remarkable-Front-Matter README',
    'date: 2018-12-10 15:15:19',
    '---',
].join('\n'), env);

console.log(env);
/**
 * Will Output:
 * { title: 'Remarkable-Front-Matter README', date: 2018-12-10T15:15:19.000Z }
 /
```

All the examples above are written in TypeScript, which means that JavaScript
usage is surely without problem.

However, I found that the design of Remarkable itself is actually not friendly for
TypeScript Users to develop plugins, as well.
