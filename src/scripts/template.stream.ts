import * as less from 'less';
import * as _ from 'lodash';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import * as stream from 'stream';
import * as through from 'through2';
import { RegisterExtensionContext, TemplateContext } from '../interfaces';
import { CmdMandocOptionsPrintConf, DocumentDescriptor, Style } from '../interfaces';
import { CSS_HELPER_FACTORY, JS_HELPER_FACTORY } from './template.helper';
const nunjucks_runtime = require('nunjucks').runtime;
const TemplateLoader = require('../lib/njk-loader').TemplateLoader;

// https://developer.mozilla.org/en-US/docs/Web/CSS/@page/size#Values
const PAPER_FORMATS: {
  [key: string]: {
    portrait: { width: string, height: string },
    landscape: { width: string, height: string },
  },
} = {
  'a5': {
    'portrait': { width: '148mm', height: '210mm' },
    'landscape': { width: '210mm', height: '148mm' },
  },
  'a4': {
    'portrait': { width: '210mm', height: '297mm' },
    'landscape': { width: '297mm', height: '210mm' },
  },
  'a3': {
    'portrait': { width: '297mm', height: '420mm' },
    'landscape': { width: '420mm', height: '297mm' },
  },
  'b5': {
    'portrait': { width: '176mm', height: '250mm' },
    'landscape': { width: '250mm', height: '176mm' },
  },
  'b4': {
    'portrait': { width: '250mm', height: '353mm' },
    'landscape': { width: '353mm', height: '250mm' },
  },
  'jis-b5': {
    'portrait': { width: '182mm', height: '257mm' },
    'landscape': { width: '257mm', height: '182mm' },
  },
  'jis-b4': {
    'portrait': { width: '257mm', height: '364mm' },
    'landscape': { width: '364mm', height: '257mm' },
  },
  'letter': {
    'portrait': { width: '216mm', height: '279mm' },
    'landscape': { width: '280mm', height: '215mm' },
  },
  'legal': {
    'portrait': { width: '216mm', height: '355mm' },
    'landscape': { width: '356mm', height: '215mm' },
  },
  'ledger': {
    'portrait': { width: '279mm', height: '431mm' },
    'landscape': { width: '432mm', height: '280mm' },
  },
};

/**
 * Doc Object --> HTML stream
 * @param tplCtx
 * @param register
 */
export function NJK_STREAM_FACTORY(
  tplCtx: TemplateContext, print: CmdMandocOptionsPrintConf,
  register: RegisterExtensionContext): stream.Transform {
  return through({ objectMode: true }, function (report: DocumentDescriptor, enc, flush) {
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
    njk_env.render(
      tplCtx.main,
      _.assign({}, report, _.assign({
        css: CSS_HELPER_FACTORY(tplCtx),
        js: JS_HELPER_FACTORY(tplCtx),
        print: {
          paperSize: print.pageSize,
          paperWidth: PAPER_FORMATS[(print.pageSize || 'A4').toLowerCase()]['portrait'].width,
          paperHeight: PAPER_FORMATS[(print.pageSize || 'A4').toLowerCase()]['portrait'].height,
          paperOrientation: 'portrait',
        },
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
export function LESS_STREAM_FACTORY(tplCtx: TemplateContext) {
  return through({ objectMode: true }, function (ref: Style, enc, flush) {
    less.render(ref.text, ref).then(output => {
      flush(undefined, output.css);
    }, error => {
      flush(error);
    });
  });
}
