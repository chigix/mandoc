import { fixture } from '@fixtures';
import * as fs from 'fs';
import { TPL_PKG_ALIASES } from 'mandoc/alias.const';
import { DocumentDescriptor } from 'mandoc/interfaces';
import { renderMarkdown } from 'mandoc/scripts/md2html.stream';
import { getConfig } from 'mandoc/scripts/template.config';
import * as path from 'path';
import * as through from 'through2';

function markdownStream(file: string) {
  return fs.createReadStream(file)
    .pipe(renderMarkdown({
      baseDir: path.dirname(file),
    }));
}

test('Basic RenderMarkdown', () => {
  markdownStream(fixture('ipsum.md'))
    .pipe(through.obj((report: DocumentDescriptor, enc, cb) => {
      expect(report.body).toMatchSnapshot();
      cb();
    }));
  markdownStream(fixture('keiyaku-test.md'))
    .pipe(through.obj((report: DocumentDescriptor, enc, cb) => {
      expect(report.body).toMatchSnapshot();
      cb();
    }));
});

test('Basic Template Rendering', done => {
  markdownStream(fixture('ipsum.md'))
    .pipe(
      getConfig(TPL_PKG_ALIASES.default, {
        paperWidth: 446,
        paperHeight: 446,
      }).renderers.njk.stream)
    .pipe(through((chunk: Buffer, enc, cb) => {
      expect(enc).toBe('buffer');
      expect(chunk.toString('utf8')).toMatchSnapshot();
      cb();
      done();
    }));
});
