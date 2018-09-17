import * as fs from 'fs';
import * as path from 'path';
import * as through from 'through2';
import { Style } from '../interfaces';
import * as util from '../lib/util';
import {
  TPL_CFG_MAIN_FILE,
  TPL_CFG_SOURCE,
} from '../paths.const';
import { Context } from './template.config';
import { LESS_STREAM_FACTORY } from './template.stream';
const requireg = require('requireg');
const slash = require('slash');
const nunjucks_runtime = require('nunjucks').runtime;

/**
 * Learned from
 * https://github.com/hexojs/hexo/blob/5234c4a85dc6cd418e9a1c169e43de169cf98e95/lib/plugins/helper/css.js
 *
 */
export function CSS_HELPER_FACTORY(tplCtx: Context) {
  return function (file: string) {
    const url = util.urlFor(file + '.css', {
      rootDir: tplCtx.cssBaseDir || '',
      baseDir: path.join(tplCtx.rootDir, path.dirname(TPL_CFG_MAIN_FILE)),
    });
    const less_url = util.urlFor(file + '.less', {
      rootDir: tplCtx.cssBaseDir || '',
      baseDir: path.join(tplCtx.rootDir, path.dirname(TPL_CFG_MAIN_FILE)),
    });
    if (fs.existsSync(path.join(tplCtx.rootDir, TPL_CFG_SOURCE, less_url))) {
      const full_path = slash(path.join(tplCtx.rootDir, TPL_CFG_SOURCE, url));
      fs.createReadStream(full_path)
        .pipe(through.obj((chunk: Buffer, enc, flush) => {
          flush(undefined, {
            compress: false,
            filename: path.basename(full_path),
            paths: path.dirname(full_path),
            text: chunk.toString('utf8'),
          } as Style);
        }))
        .pipe(LESS_STREAM_FACTORY(tplCtx))
        .pipe(fs.createWriteStream(full_path.replace(/\.less/gi, '') + '.css'));
    }

    return new nunjucks_runtime.SafeString(
      '<link rel="stylesheet" type="text/css" href="'
      + 'file:///' + slash(path.join(tplCtx.rootDir, TPL_CFG_SOURCE, url))
      + '">');

  };
}

/**
 * Learned from
 * https://github.com/hexojs/hexo/blob/5234c4a85dc6cd418e9a1c169e43de169cf98e95/lib/plugins/helper/js.js
 */
export function JS_HELPER_FACTORY(tplCtx: Context) {
  return function (file: string) {
    let url = util.urlFor(file + '.js', {
      rootDir: path.join(tplCtx.rootDir, TPL_CFG_SOURCE),
      baseDir: path.join(tplCtx.rootDir, path.dirname(TPL_CFG_MAIN_FILE)),
    });
    if (url.startsWith('/')) {
      url = 'file:///' + slash(path.join(tplCtx.rootDir, TPL_CFG_SOURCE, url));
    }

    return new nunjucks_runtime.SafeString('<script src="'
      + url + '"></script>');
  };
}
