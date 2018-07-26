import * as fs from 'fs';
import * as path from 'path';
import { isString } from 'util';
const slash = require('slash');

export function urlFor(p: string, ctx: {
  baseDir: fs.PathLike,
  rootDir: fs.PathLike,
}) {
  const root_dir_path = isString(ctx.rootDir) ?
    ctx.rootDir : ctx.rootDir.toString();
  const base_dir_path = isString(ctx.baseDir) ?
    ctx.baseDir : ctx.baseDir.toString();
  if (p.startsWith('http://') || p.startsWith('https://')) {
    return p;
  }
  if (fs.existsSync(path.join(root_dir_path, p)) && fs.lstatSync(
    path.join(root_dir_path, p),
  ).isFile()) {
    return slash(p).startsWith('/') ? slash(p) : slash(path.join('/', p));
  }

  return slash(path.join('/', path.relative(
    root_dir_path, path.join(base_dir_path, p),
  )));
}
