import * as path from 'path';
import * as sh from 'shelljs';

const PKG_ROOT = path.resolve(__dirname, '../dist');

const a = sh.ls('-R', PKG_ROOT).forEach(f => {
  if (f.endsWith('.js.map')) {
    sh.rm(path.resolve(PKG_ROOT, f));
  }
});
