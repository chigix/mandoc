/**
 * Learned from:
 * https://github.com/ReactiveX/rxjs/blob/6.3.3/.make-packages.js
 */

import * as fs from 'fs-extra';
import * as klawSync from 'klaw-sync';
import * as _ from 'lodash';
import * as path from 'path';
import * as sh from 'shelljs';
const pkg = require('./package.json');
const slash = require('slash');

const LERNA_ROOT = path.resolve(__dirname, '../../') + '/';
const ROOT = path.resolve(__dirname, './dist') + '/';
const CJS_ROOT = ROOT + 'cjs/';
const ESM5_ROOT = ROOT + 'esm5/';
const ESM2015_ROOT = ROOT + 'esm2015/';
const TYPE_ROOT = ROOT + 'typings/';
const PKG_ROOT = ROOT + 'package/';
const CJS_PKG = PKG_ROOT + '';
const ESM5_PKG = PKG_ROOT + '_esm5/';
const ESM2015_PKG = PKG_ROOT + '_esm2015/';
const SRC_ROOT_PKG = PKG_ROOT + 'src/';
const TYPE_PKG = PKG_ROOT;

class Helper {
  static cleanSourceMapRoot(mapRoot: string, sourcesRoot: string) {
    klawSync(mapRoot, {
      traverseAll: true,
      filter: file => file.path.endsWith('.js.map'),
    })
      .map(f => f.path)
      .forEach(fPath => {
        const sourceMap = fs.readJsonSync(fPath);
        // Get relative path from map file to source file
        sourceMap.sources = sourceMap.sources.map((s: string) => slash(path.relative(
          path.parse(fPath).dir,
          path.resolve(path.join(sourcesRoot, s)),
        )));
        delete sourceMap.sourceRoot;
        fs.writeJsonSync(fPath, sourceMap);
      });
  }
}

fs.removeSync(PKG_ROOT);

const rootPackageJson = _.assign({}, pkg, {
  name: 'mandoc',
  main: 'index.js',
  typings: './index.d.ts',
  bin: {
    'mandoc': './bin/mandoc',
    // TODO: mandoc-gen for generating template package since 2.0+
    // 'mandoc-gen': './bin/mandoc-gen',
  },
  module: './_esm5/index.js',
  es2015: './_esm2015/index.js',
});
delete rootPackageJson.devDependencies;
delete rootPackageJson.scripts;
delete rootPackageJson.private;

// Make the distribution folder
sh.mkdir('-p', PKG_ROOT);

// Copy over the sources
sh.cp('-R', path.resolve(__dirname, 'src'), SRC_ROOT_PKG);

fs.copySync(CJS_ROOT + 'src/', CJS_PKG);

// Copy Special Files
sh.cp(CJS_ROOT + 'paths.const*', CJS_PKG);

klawSync(path.resolve(__dirname, 'src'), {
  traverseAll: true,
  filter: file => file.path.endsWith('.js'),
}).map(f => f.path)
  .forEach(fPath => {
    // Get relative path from map file to source file
    fs.copySync(fPath, CJS_PKG + slash(path.relative(
      path.resolve(path.resolve(__dirname, 'src')),
      fPath,
    )));
  });

// Clean up the source maps for CJS sources
Helper.cleanSourceMapRoot(PKG_ROOT, SRC_ROOT_PKG);
fs.copySync(TYPE_ROOT + 'src/', TYPE_PKG);
sh.cp(TYPE_ROOT + 'paths.const*', TYPE_PKG);
fs.copySync(ESM5_ROOT + 'src/', ESM5_PKG);
sh.cp(ESM5_ROOT + 'paths.const*', ESM5_PKG);
Helper.cleanSourceMapRoot(ESM5_PKG, SRC_ROOT_PKG);
fs.copySync(ESM2015_ROOT + 'src/', ESM2015_PKG);
sh.cp(ESM2015_ROOT + 'paths.const*', ESM2015_PKG);
Helper.cleanSourceMapRoot(ESM2015_PKG, SRC_ROOT_PKG);

fs.writeJsonSync(PKG_ROOT + 'package.json', rootPackageJson, { spaces: 2 });
sh.find(CJS_PKG + 'bin/').filter(file => file.match(/\.js$/))
  .forEach(file => sh.mv(file, file.slice(0, -3)));
sh.cp(LERNA_ROOT + 'LICENSE', PKG_ROOT);
sh.cp(path.resolve(__dirname, 'README.md'), PKG_ROOT);
