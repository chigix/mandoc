import * as fs from 'fs';
import * as path from 'path';
import { TemplateContext } from '../interfaces';

export function getTplPkgName(tpl_pkg: TemplateContext): string {
  if (fs.existsSync(path.resolve(tpl_pkg.rootDir, 'package.json'))) {
    const name_try = require(path.resolve(tpl_pkg.rootDir, 'package.json')).name;
    if (name_try) {
      return name_try;
    }
  }

  return tpl_pkg.rootDir;
}
