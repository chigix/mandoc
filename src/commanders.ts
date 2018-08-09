import chalk from 'chalk';
import * as Commander from 'commander';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';
import * as stream from 'stream';
import * as through from 'through2';
import { extName } from './lib/util';
import { renderMarkdown } from './scripts/html.render';
import { getConfig as templateConfigure } from './scripts/template.config';
const errno = require('errno');

export const DEFAULT_CONVERTER_OPTS = {
  template: 'default',
  tableOfContents: false,
  output: undefined,
};

export const DocConverter = {
  description: 'Markdown Document Converting Tool',
  usage: '[options] <FILE>',
  configureOptions: (command: Commander.CommanderStatic) => {
    command.option('<FILE>', 'Path of the markdown file to convert. '
      + 'If no source file specified, the stdin is to be used');
    command.option('-o, --output [FILE]', 'Write output to FILE instead of stdout');
    command.option('-w, --watch', 'Watch file for changes and rewrite');
    command.option('-f, --from [FORMAT]', 'Specify input format. Markdown Default');
    command.option('--template [NAME|DIR]',
      'Use a template instead of the default for the generated document',
    );
    command.option('--toc, --table-of-contents', 'non-null value if specified');
    command.option('--toc-title', 'title of table of contents');
    command.option('--lint', 'Lint Tool to check format and style issues in the document');
    // Planed in the future. Smart Quotes is needed for tex input improve
    // command.option('--smart', 'Interpret quotes, hyphens and ellipses');
    command.option('--verbose', 'Give verbose debugging output');

    return command;
  },
  receiver: (file: string, cmd: { [key: string]: string }) => {
    try {
      if (!fs.lstatSync(file).isFile()) {
        throw 'Markdown Source File is not existed.';
      }
    } catch (error) {
      if (!errno.code[error.code]) {
        throw error;
      }
      console.error(chalk.redBright(errno.code[error.code].description + ' : '
        + error.path || file));

      return;
    }
    const options = _.assign(DEFAULT_CONVERTER_OPTS, {
      output: file.replace(/\.m(ark)?d(own)?/gi, '') + '.html',
    }, cmd);
    fs.createReadStream(
      file,
    ).pipe((
      ({
        'md': () => renderMarkdown({
          baseDir: path.dirname(file),
        }),
        'markdown': () => renderMarkdown({
          baseDir: path.dirname(file),
        }),
      } as {
          [key: string]: (() => stream.Transform) | undefined,
        })[extName(file)]
      || (() => through())
    )(),
    ).pipe(
      (function tplStream() {
        const tpl_cfg = templateConfigure(options);

        return tpl_cfg.renderers[extName(tpl_cfg.main)]
          || tpl_cfg.renderers.njk;
      })().stream.on('error', function (e) {
        chalk.redBright(e.stack as string);
      }),
    ).pipe(fs.createWriteStream(options.output));
  },
};

export const HtmlTemplateGenerator = {
  description: 'Generate Html Template for Converting',
  arguments: '',
  configureOptions: (command: typeof Commander) => {
    return command;
  },
  receiver: (file: string) => {
    console.log(file);
  },
};
