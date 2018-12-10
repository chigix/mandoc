import * as hljs from 'highlight.js';
import * as _ from 'lodash';
import * as Remarkable from 'remarkable';
import frontMatterPlugin from 'remarkable-front-matter';
import * as stream from 'stream';
import * as through from 'through2';
import { DocumentDescriptor, Path } from '../interfaces';

/**
 * TODO accept basedir option in the future to support including compiling
 */
function createMarkdownParser() {
  const md = new Remarkable({
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

  md.use(frontMatterPlugin);

  return md;
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
    const env = { frontMatter: undefined };
    const parsed = createMarkdownParser().render(md, env);
    this.push(_.assign({
      // TODO separate first header as title
      title: 'Report',
      author: [],
      // External Resources reference is a problem here
      // TODO At least image paths could be collected through markdown parser
      // ?? Site Compiling should be a solution..
      body: '',
    } as DocumentDescriptor,
      env.frontMatter || {},
      { body: parsed }));
    cb();
    md = '';
  });
}
