import * as fs from 'fs';
import * as path from 'path';
import { isString } from 'util';
const slash = require('slash');
const jsonlint = require('jsonlint');

/**
 * Should only be used in site mode.
 *
 * @param p target file path
 * @param ctx
 */
export function urlFor(p: string, ctx: {
  baseDir: fs.PathLike,
  rootDir: fs.PathLike,
}): string {
  if (p.startsWith('http://') || p.startsWith('https://')) {
    return p;
  }
  const root_dir_path = isString(ctx.rootDir) ?
    ctx.rootDir : ctx.rootDir.toString();
  const base_dir_path = isString(ctx.baseDir) ?
    ctx.baseDir : ctx.baseDir.toString();
  if (isFile(path.join(root_dir_path, p))) {
    return slash(p).startsWith('/') ? slash(p) : slash(path.join('/', p));
  }

  return slash(path.join('/', path.relative(
    root_dir_path, path.join(base_dir_path, p),
  )));
}

export function isJSONString(text: string) {
  return text.startsWith('{') &&
    text.endsWith('}');
}

export function isFile(filePath: fs.PathLike) {
  return fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory();
}

export function jsonlintErrCatch(input: string) {
  try {
    jsonlint.parse(input);
  } catch (error) {
    return error.stack;
  }
}

/**
 * Learned from
 * https://github.com/hexojs/hexo/commit/2ad42b3501554ce48401c09ee3b4158d4b6e38f7#diff-5b9787c2de58e4aa04138e83d461159eL20
 *
 * @param file
 */
export function extName(file: string) {
  const extname = path.extname(file);

  return extname[0] === '.' ? extname.slice(1) : extname;
}
