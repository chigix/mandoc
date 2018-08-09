import * as _ from 'lodash';
import * as nunjucks from 'nunjucks';
import * as stream from 'stream';
import * as through from 'through2';
import * as CONST from '../lib/constants';
import { Doc } from '../types';
import { Context, RegisterExtensionContext } from './template.config';
import { CSS_HELPER_FACTORY, JS_HELPER_FACTORY } from './template.helper';
const nunjucks_runtime = require('nunjucks').runtime;

export function NJK_STREAM_FACTORY(
  tplCtx: Context,
  register: RegisterExtensionContext): stream.Transform {
  return through({ objectMode: true }, function (report: Doc, enc, flush) {
    const tpl_dir = tplCtx.rootDir;
    report.body = new nunjucks_runtime.SafeString(report.body);
    const njk_env = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(tpl_dir),
    );
    try {
      const html_result = njk_env.render(
        CONST.TPL_HTML_PATH,
        _.assign({}, report, _.assign({
          css: CSS_HELPER_FACTORY(tplCtx),
          js: JS_HELPER_FACTORY(tplCtx),
        }, register.helpers)));
      this.push(html_result);
    } catch (error) {
      return flush(error, null);
    }

    return flush();
  });
}
