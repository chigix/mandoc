import * as fs from 'fs-extra';
import * as less from 'less';
import * as path from 'path';
import * as sh from 'shelljs';

const PKG_ROOT = path.resolve(__dirname, '../');
const DIST_ROOT = path.resolve(__dirname, '../dist');

(function makeDefaultTemplatePkg() {
  const src_dir = path.resolve(PKG_ROOT, './templates/default');
  const dist_dir = path.resolve(DIST_ROOT, './templates/default');
  sh.mkdir('-p', dist_dir);
  sh.cp('-R', src_dir, path.resolve(DIST_ROOT, './templates'));
  less.render(
    fs.readFileSync(path.resolve(dist_dir, './source/style.less'))
      .toString('utf8'),
    {
      filename: path.resolve(dist_dir, './source/style.less'),
      paths: [path.resolve(dist_dir, './source')],
    })
    .then(
      output => fs.writeFileSync(
        path.resolve(dist_dir, './source/style.css'), output.css),
    ).catch(e => console.log(e))
    .then(_ => sh.rm(path.resolve(dist_dir, './**/*.less')));
})();
