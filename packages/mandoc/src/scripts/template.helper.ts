import * as fs from 'fs';
import * as path from 'path';
import * as through from 'through2';
import { Style, TemplateContext } from '../interfaces';
import { TemplateFileError } from '../lib/errors';
import { getTplPkgName } from '../lib/template.util';
import * as util from '../lib/util';
import {
  TPL_DEFAULT_LAYOUT_FILE,
} from '../paths.const';
import { LESS_STREAM_FACTORY } from './template.stream';
const slash = require('slash');
const nunjucks_runtime = require('nunjucks').runtime;

/**
 * Learned from
 * https://github.com/hexojs/hexo/blob/5234c4a85dc6cd418e9a1c169e43de169cf98e95/lib/plugins/helper/css.js
 *
 */
export function CSS_HELPER_FACTORY(tplCtx: TemplateContext) {
  if (!tplCtx.cssBaseDir) {
    throw new TemplateFileError(
      `No Available CSS Resource File provided in template: ${getTplPkgName(tplCtx)}`);
  }

  const CSS_BASE_DIR = tplCtx.cssBaseDir;

  return function (file: string) {
    const url = util.urlFor(file + '.css', {
      rootDir: CSS_BASE_DIR || '',
      baseDir: path.join(tplCtx.rootDir, path.dirname(TPL_DEFAULT_LAYOUT_FILE)),
    });
    const less_url = util.urlFor(file + '.less', {
      rootDir: CSS_BASE_DIR || '',
      baseDir: path.join(tplCtx.rootDir, path.dirname(TPL_DEFAULT_LAYOUT_FILE)),
    });

    if (fs.existsSync(path.join(tplCtx.rootDir, CSS_BASE_DIR, less_url))) {
      const full_path = slash(path.join(tplCtx.rootDir, CSS_BASE_DIR, url));
      fs.createReadStream(full_path)
        .pipe(through.obj((chunk: Buffer, enc, flush) => {
          flush(undefined, {
            compress: false,
            filename: path.basename(full_path),
            paths: [path.dirname(full_path)],
            text: chunk.toString('utf8'),
          } as Style);
        }))
        // TODO: Remove stream dependency from template building
        //       Which result in circular import.
        .pipe(LESS_STREAM_FACTORY(tplCtx))
        .pipe(fs.createWriteStream(full_path.replace(/\.less/gi, '') + '.css'));
    }

    return new nunjucks_runtime.SafeString(
      '<link rel="stylesheet" type="text/css" href="'
      + 'file:///' + slash(path.join(tplCtx.rootDir, CSS_BASE_DIR, url))
      + '">');

  };
}

/**
 * Learned from
 * https://github.com/hexojs/hexo/blob/5234c4a85dc6cd418e9a1c169e43de169cf98e95/lib/plugins/helper/js.js
 */
export function JS_HELPER_FACTORY(tplCtx: TemplateContext) {
  if (!tplCtx.jsBaseDir) {
    throw new TemplateFileError(
      `No Available CSS Resource File provided in template: ${getTplPkgName(tplCtx)}`);
  }

  const JS_BASE_DIR = tplCtx.jsBaseDir;

  return function (file: string) {
    let url = util.urlFor(file + '.js', {
      rootDir: path.join(tplCtx.rootDir, JS_BASE_DIR),
      baseDir: path.join(tplCtx.rootDir, path.dirname(TPL_DEFAULT_LAYOUT_FILE)),
    });
    if (url.startsWith('/')) {
      url = 'file:///' + slash(path.join(tplCtx.rootDir, JS_BASE_DIR, url));
    }

    return new nunjucks_runtime.SafeString('<script src="'
      + url + '"></script>');
  };
}
