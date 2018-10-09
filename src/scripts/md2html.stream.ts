import * as hljs from 'highlight.js';
import * as Remarkable from 'remarkable';
import * as stream from 'stream';
import * as through from 'through2';
import { DocumentDescriptor, Path } from '../interfaces';

/**
 * TODO accept basedir option in the future to support including compiling
 */
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
  baseDir: Path,
}): stream.Transform {
  let md = '';

  return through({ objectMode: true }, function (chunk: Buffer, enc, flush) {
    md += chunk;
    flush();
  }, function flush(cb) {
    this.push({
      title: 'Report',
      author: [],
      // External Resources reference is a problem here
      // @TODO: At least image paths could be collected through markdown parser
      body: createMarkdownParser().render(md),
    } as DocumentDescriptor);
    cb();
    md = '';
  });
}
