import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as _ from 'lodash';
import * as mandocConsts from 'mandoc/paths.const';
import * as path from 'path';
import * as sh from 'shelljs';
const stringLength = require('string-length');

const OK = chalk.reset.inverse.bold.green(' DONE ');
const pkg_json_path = path.resolve(__dirname, '../package.json');

const PKG_ROOT = path.resolve(__dirname, '../dist');
const SRC_ROOT = path.resolve(__dirname, '../src');
const BIN_PKG = path.join(PKG_ROOT, './bin');

if (!fs.existsSync(PKG_ROOT)) {
  process.stderr.write(chalk.red('Can\'t find dist directory.\n'
    + 'Make sure typescript files building was done.\n'));
  process.exit(1);
}

if (!fs.existsSync(pkg_json_path)) {
  process.stderr.write(chalk.red('Can\'t find package json file to build package.\n'));
  process.exit(1);
}

/**
 * Learned from
 * https://github.com/facebook/jest/blob/36dcb7873e18e4fb059653cfef3bfb35359e6195/scripts/build.js#L54
 *
 */
function adjustToTerminalWidth(str: string) {
  const columns = process.stdout.columns || 80;
  const WIDTH = columns - stringLength(OK) + 1;
  const strs = str.match(new RegExp(`(.{1,${WIDTH}})`, 'g')) as string[];
  let lastString = strs[strs.length - 1];
  if (lastString.length < WIDTH) {
    lastString += Array(WIDTH - lastString.length).join(chalk.dim('.'));
  }

  return strs
    .slice(0, -1)
    .concat(lastString)
    .join('\n');
}

(function main() {
  process.stdout.write(chalk.inverse(' Building package \n'));
  const package_config = require(pkg_json_path);
  // Learned from
  // https://github.com/ReactiveX/rxjs/blob/d5658fe68093861e0612be3c8c045f973168b87c/.make-packages.js#L45
  delete package_config.devDependencies;
  delete package_config.scripts;
  fs.writeJsonSync(path.resolve(PKG_ROOT, './package.json'),
    _.assign({}, package_config, {
      name: 'mandoc',
      main: './index.js',
      typings: './index.d.ts',
      bin: {
        'mandoc': './bin/mandoc',
        'mandoc-gen': './bin/mandoc-gen',
      },
      // Try in future commits, referring to the practice in rxjs repository.
      // module: './_esm5/index.js',
      // es2015: './_esm2015/index.js',
    }), {
      spaces: 2,
    });
  sh.find(path.join(PKG_ROOT, './bin'))
    .filter(file => file.match(/\.js$/))
    .forEach(file => sh.mv(file, file.slice(0, - 3)));
  sh.find(SRC_ROOT)
    .filter(file => file.match(/\.js$/))
    .forEach(file => sh.cp(
      file, path.resolve(PKG_ROOT, path.relative(SRC_ROOT, file)),
    ));
})();
