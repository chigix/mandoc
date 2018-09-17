#!/usr/bin/env node

import chalk from 'chalk';
import * as program from 'commander';
import * as fs from 'fs';
import _ = require('lodash');
import * as path from 'path';
import * as stream from 'stream';
import * as through from 'through2';
import { CmdMandocOptions, OutputBuild } from '../interfaces';
import { extName } from '../lib/util';
import { PKG_ROOT } from '../paths.const';
import SiteWrapper from '../scripts/html2site.stream';
import { renderMarkdown } from '../scripts/md2html.stream';
import PDFStream from '../scripts/site2pdf.stream';
import { getConfig as templateConfigure } from '../scripts/template.config';

const pkg_json = require(path.resolve(PKG_ROOT, './package.json'));

program.version(pkg_json.version, '-v, --version')
  .description(pkg_json.description)
  .usage('[options] <FILE>')
  .option('<FILE>', 'Path of the markdown file to convert. '
    + 'If no source file specified, the stdin is to be used')
  .option('-o, --output [FILE]', 'Write output to FILE instead of stdout')
  .option('-w, --watch', 'Watch file for changes and rewrite')
  .option('-f, --from [FORMAT]', 'Specify input format. Markdown Default')
  .option('--template [NAME|DIR]',
    'Use a template instead of the default for the generated document')
  .option('--toc, --table-of-contents', 'non-null value if specified')
  .option('--toc-title', 'title of table of contents')
  .option('--lint', 'Lint Tool to check format and style issues in the document')
  // Planed in the future. Smart Quotes is needed for tex input improve
  // command.option('--smart', 'Interpret quotes, hyphens and ellipses');
  // Planed in the future. Only try to remove dependencies in markdown content.
  // External Dependencies in templates is not involved.
  // command.option('--self-contained',
  //   'Produce a standalone HTML file with no external dependencies');
  .option('--verbose', 'Give verbose debugging output')
  .action((file: string, cmd: { [key: string]: string }) => {
    try {
      if (!fs.lstatSync(file).isFile()) {
        throw 'Markdown Source File is not existed.';
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        process.stderr.write(
          chalk.redBright('No such file or directory : ' + error.path || file));

        return;
      }
      throw error;
    }
    const options = _.assign({
      template: 'default',
      tableOfContents: false,
      output: file.replace(/\.m(ark)?d(own)?/gi, '') + '.pdf',
      watch: false,
      build: OutputBuild.StandaloneFile,
    } as CmdMandocOptions, cmd);

    const tpl_cfg = templateConfigure(options);

    fs.createReadStream(
      file,
      { autoClose: true },
    ).pipe(
      (
        ({
          'md': () => renderMarkdown({
            baseDir: path.dirname(file),
          }),
          'markdown': () => renderMarkdown({
            baseDir: path.dirname(file),
          }),
          // @TODO: Tex Support here
        } as {
            [key: string]: (() => stream.Transform) | undefined,
          }
        )[extName(file)] || (() => through())
      )(),
    ).pipe(
      (function tplStream() {
        return tpl_cfg.renderers[extName(tpl_cfg.main)]
          || tpl_cfg.renderers.njk;
      })().stream.on('error', function (e) {
        chalk.redBright(e.stack as string);
      }),
    ).pipe(
      SiteWrapper(tpl_cfg),
    ).pipe(
      PDFStream(),
    ).pipe(
      fs.createWriteStream(options.output)
        .on('finish', () => {
          process.exit(0);
        }),
    );
  });

(function main() {
  if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit();
  }

  program.parse(process.argv);
})();
