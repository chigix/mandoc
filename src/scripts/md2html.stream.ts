import * as fs from 'fs';
import * as hljs from 'highlight.js';
import * as Remarkable from 'remarkable';
import * as stream from 'stream';
import * as through from 'through2';
import { Doc } from '../interfaces';

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
