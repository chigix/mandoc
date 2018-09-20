import * as less from 'less';
import * as _ from 'lodash';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import * as stream from 'stream';
import * as through from 'through2';
import { Doc, Style } from '../interfaces';
import { Context, RegisterExtensionContext } from './template.config';
import { CSS_HELPER_FACTORY, JS_HELPER_FACTORY } from './template.helper';
const nunjucks_runtime = require('nunjucks').runtime;
const TemplateLoader = require('../lib/njk-loader').TemplateLoader;

/**
 * Doc Object --> HTML stream
 * @param tplCtx
 * @param register
 */
export function NJK_STREAM_FACTORY(
  tplCtx: Context,
  register: RegisterExtensionContext): stream.Transform {
  return through({ objectMode: true }, function (report: Doc, enc, flush) {
    report.body = new nunjucks_runtime.SafeString(report.body);
    const search_paths = [tplCtx.rootDir];
    if (tplCtx.cssBaseDir) {
      search_paths.push(path.join(tplCtx.rootDir, tplCtx.cssBaseDir));
    }
    if (tplCtx.jsBaseDir && tplCtx.jsBaseDir != tplCtx.cssBaseDir) {
      search_paths.push(path.join(tplCtx.rootDir, tplCtx.jsBaseDir));
    }
    const njk_env = new nunjucks.Environment(
      new TemplateLoader(search_paths),
    );
    const self = this;
    njk_env.render(
      tplCtx.main,
      _.assign({}, report, _.assign({
        css: CSS_HELPER_FACTORY(tplCtx),
        js: JS_HELPER_FACTORY(tplCtx),
      }, register.helpers)), (err, html_result) => {
        if (err) {
          console.error(err);
          flush();

          return;
        }
        this.push(html_result);
        flush();
      });
  });
}

/**
 * Style Object --> Compiled CSS Stream
 *
 * @TODO check again if it is needed to be removed
 * @param tplCtx
 */
export function LESS_STREAM_FACTORY(tplCtx: Context) {
  return through({ objectMode: true }, function (ref: Style, enc, flush) {
    less.render(ref.text, ref).then(output => {
      flush(undefined, output.css);
    }, error => {
      flush(error);
    });
  });
}
