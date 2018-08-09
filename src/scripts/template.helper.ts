import * as fs from 'fs';
import * as path from 'path';
import * as CONST from '../lib/constants';
import * as util from '../lib/util';
import { Context } from './template.config';
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
    let url = util.urlFor(file + '.css', {
      rootDir: path.join(tplCtx.rootDir, CONST.TPL_SRC_PATH),
      baseDir: path.join(tplCtx.rootDir, CONST.TPL_LAYOUT_PATH),
    });
    const less_url = util.urlFor(file + '.less', {
      rootDir: path.join(tplCtx.rootDir, CONST.TPL_SRC_PATH),
      baseDir: path.join(tplCtx.rootDir, CONST.TPL_LAYOUT_PATH),
    });
    if (fs.existsSync(path.join(tplCtx.rootDir, CONST.TPL_SRC_PATH, less_url))) {
      url = less_url;
    }

    return new nunjucks_runtime.SafeString(
      '<link rel="stylesheet" type="text/css" href="'
      + 'file:///' + slash(path.join(tplCtx.rootDir, CONST.TPL_SRC_PATH, url))
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
      rootDir: path.join(tplCtx.rootDir, CONST.TPL_SRC_PATH),
      baseDir: path.join(tplCtx.rootDir, CONST.TPL_LAYOUT_PATH),
    });
    if (url.startsWith('/')) {
      url = 'file:///' + slash(path.join(tplCtx.rootDir, CONST.TPL_SRC_PATH, url));
    }

    return new nunjucks_runtime.SafeString('<script src="'
      + url + '"></script>');
  };
}
