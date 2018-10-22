#!/usr/bin/env node

import chalk from 'chalk';
import * as program from 'commander';
import * as fs from 'fs';
import _ = require('lodash');
import * as path from 'path';
import * as stream from 'stream';
import * as through from 'through2';
import { CmdMandocOptions, Path } from '../interfaces';
import { DocumentNotFoundError } from '../lib/errors';
import { extName } from '../lib/util';
import { PKG_ROOT } from '../paths.const';
import SiteWrapper from '../scripts/html2site.stream';
import { renderMarkdown } from '../scripts/md2html.stream';
import createPDFRenderStream from '../scripts/site2pdf.stream';
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
  .option('-t, --to [FORMAT]', 'Specify output format. PDF Default')
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
  .action(async (
    file: Path | null,
    cmd: { [key: string]: string },
  ) => {
    if (!_.isString(file)) {
      cmd = file || {};
      file = null;
    }
    if (_.isString(cmd)) {
      process.stderr.write(chalk.redBright(`Unrecognized option: '${cmd}'`));
      process.exit(1);
    }

    const options = (function validateAndFixOptions() {
      const ext_name = _.isNull(file) ? '.md' : path.extname(file);
      const result = _.assign({
        from: ext_name.substring(1),
        to: 'pdf',
        template: 'default',
        tableOfContents: false,
        pageSize: 'A4',
        output: _.isString(file) ?
          file.substring(0, file.length - ext_name.length) :
          null,
        watch: false,
      } as CmdMandocOptions, cmd);
      if (result.to && result.output) {
        result.output = `${result.output}.${result.to}`;
      }
      if (!_.isString(result.output)) {
        process.stderr.write(chalk.redBright('Please provide output path'));
        process.exit(1);
      }

      return result;
    })();

    const start_stream = await new Promise<NodeJS.ReadableStream>(
      (resolve, reject) => {
        if (_.isNull(file)) {
          return resolve(process.stdin);
        }
        const file_path = file;
        fs.lstat(file_path, (err, stats) => {
          if (err) {
            return reject(err);
          }
          if (!stats.isFile()) {
            return reject(new DocumentNotFoundError(
              `Markdown Source File is not existed: ${file}`));
          }

          return resolve(fs.createReadStream(file_path));
        });
      }).catch((err) => {
        if (err.errno && err.code === 'ENOENT') {
          chalk.redBright('No such file or directory : ' + file);
        } else if (err instanceof DocumentNotFoundError) {
          chalk.redBright('No such file or directory : ' + file);
        } else {
          throw err;
        }
      });

    if (!start_stream) {
      return;
    }

    const tpl_cfg = templateConfigure(options.template);

    let building_stream = start_stream.pipe(
      (
        ({
          'md': () => renderMarkdown({
            baseDir: file ? path.dirname(file) : process.cwd(),
          }),
          'markdown': () => renderMarkdown({
            baseDir: file ? path.dirname(file) : process.cwd(),
          }),
          // TODO: Tex Support here
        } as {
            [key: string]: (() => stream.Transform) | undefined,
          }
        )[options.from] || (() => through())
      )(),
    ).pipe(
      (function tplStream() {
        return tpl_cfg.renderers[extName(tpl_cfg.main)]
          || tpl_cfg.renderers.njk;
      })().stream.on('error', function (e) {
        chalk.redBright(e.stack as string);
      }),
    );
    if (options.to === 'pdf') {
      building_stream = building_stream.pipe(
        SiteWrapper(tpl_cfg),
      ).pipe(
        createPDFRenderStream(tpl_cfg),
      );
    }
    building_stream.pipe(
      fs.createWriteStream(options.output),
    ).on('finish', () => {
      process.exit(0);
    }).on('error', (e) => {
      process.stderr.write(chalk.redBright(e.message));
      process.exit(1);
    });
  });

(function main() {
  if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit();
  }

  program.parse(process.argv);
})();
