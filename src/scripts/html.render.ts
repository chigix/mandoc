import * as fs from 'fs';
import * as hljs from 'highlight.js';
import * as _ from 'lodash';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import * as Remarkable from 'remarkable';
import * as stream from 'stream';
import * as through from 'through2';
const nunjucks_runtime = require('nunjucks').runtime;
import { isString } from 'util';
import * as CONST from '../lib/constants';
import * as util from '../lib/util';
import { Doc } from '../types';
const errno = require('errno');
const slash = require('slash');

function createMarkdownParser() {
  return new Remarkable({
    html: true,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'language-',
    linkify: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (error) {
          console.error(error);
        }
      }
      try {
        return hljs.highlightAuto(str).value;
      } catch (error) {
        console.error(error);
      }

      return '';
    },
  });
}

/**
 * Markdown File Stream --> Doc Object
 *
 * @export
 * @param ctx
 * @returns {stream.Transform}
 */
export function renderMarkdown(ctx: {
  baseDir: fs.PathLike,
}): stream.Transform {
  let md = '';

  return through({ objectMode: true }, function (chunk: Buffer, enc, flush) {
    md += chunk;
    flush();
  }, function flush(cb) {
    this.push({
      title: 'Report',
      author: [],
      body: createMarkdownParser().render(md),
    } as Doc);
    cb();
    md = '';
  });
}

/**
 * Doc Object --> Html Stream
 * @param ctx
 */
export function renderHtml(ctx: {
  tplDir: fs.PathLike,
}) {
  const tpl_path = path.join(
    isString(ctx.tplDir) ? ctx.tplDir : ctx.tplDir.toString()
    , CONST.TPL_HTML_PATH);
  if (!fs.lstatSync(ctx.tplDir).isDirectory()) {
    throw `Template not exists: [${ctx.tplDir}]`;
  }
  if (!fs.lstatSync(tpl_path).isFile()) {
    throw `Template invalid: [${ctx.tplDir}]`;
  }

  return through({ objectMode: true }, function (report: Doc, enc, flush) {
    const tpl_dir = isString(ctx.tplDir) ? ctx.tplDir : ctx.tplDir.toString();
    report.body = new nunjucks_runtime.SafeString(report.body);
    const njk_env = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(tpl_dir),
    );
    try {
      const html_result = njk_env.render(
        CONST.TPL_HTML_PATH,
        _.assign({}, report, {
          css: function (file: string) {
            let url = util.urlFor(file + '.css', {
              rootDir: path.join(tpl_dir, CONST.TPL_SRC_PATH),
              baseDir: path.join(tpl_dir, CONST.TPL_LAYOUT_PATH),
            });
            const less_url = util.urlFor(file + '.less', {
              rootDir: path.join(tpl_dir, CONST.TPL_SRC_PATH),
              baseDir: path.join(tpl_dir, CONST.TPL_LAYOUT_PATH),
            });
            if (fs.existsSync(path.join(tpl_dir, CONST.TPL_SRC_PATH, less_url))) {
              url = less_url;
            }

            return new nunjucks_runtime.SafeString('<link rel="stylesheet" type="text/css" href="'
              + 'file:///' + slash(path.join(tpl_dir, CONST.TPL_SRC_PATH, url))
              + '">');
          },
          js: function (file: string) {
            let url = util.urlFor(file + '.js', {
              rootDir: path.join(tpl_dir, CONST.TPL_SRC_PATH),
              baseDir: path.join(tpl_dir, CONST.TPL_LAYOUT_PATH),
            });
            if (url.startsWith('/')) {
              url = 'file:///' + slash(path.join(tpl_dir, CONST.TPL_SRC_PATH, url));
            }

            return new nunjucks_runtime.SafeString('<script src="'
              + url + '"></script>');
          },
        }));

      return flush(null, html_result);
    } catch (error) {
      return flush(error, null);
    }
  });
}
