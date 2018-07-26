import chalk from 'chalk';
import * as Commander from 'commander';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';
import { renderHtml, renderMarkdown } from './scripts/html.render';
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
    command.option('-f, --from [FORMAT]', 'Specify input format. Markdown Default');
    command.option('--template [NAME|DIR]',
      'Use a template instead of the default for the generated document',
    );
    command.option('--toc, --table-of-contents', 'non-null value if specified');
    command.option('--toc-title', 'title of table of contents');
    command.option('--lint', 'Lint Tool to check format and style issues in the document');
    // not sure if needed
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
    fs.createReadStream(file).pipe(renderMarkdown({
      baseDir: path.dirname(file),
    })).pipe(renderHtml({
      tplDir: path.join(__dirname, '../templates/default'),
    }));
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
