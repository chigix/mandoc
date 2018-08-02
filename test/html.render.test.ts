import * as fs from 'fs';
import * as path from 'path';
import * as through from 'through2';
import { renderHtml, renderMarkdown } from '../src/scripts/html.render';
import { Doc } from '../src/types';
import { TEMPLATE_DIR } from './constants';

function markdownStream(file: string) {
  return fs.createReadStream(file)
    .pipe(renderMarkdown({
      baseDir: path.dirname(file),
    }));
}

test('Basic RenderMarkdown', () => {
  markdownStream(path.join(__dirname, './fixtures/ipsum.md'))
    .pipe(through.obj((report: Doc, enc, cb) => {
      expect(report.body).toBe(
        fs.readFileSync(path.join(__dirname, './fixtures/ipsum.html'))
          .toString('utf8'));
    }));
  markdownStream(path.join(__dirname, './fixtures/keiyaku-test.md'))
    .pipe(through.obj((report: Doc, enc, cb) => {
      expect(report.body).toBe(
        fs.readFileSync(path.join(__dirname, './fixtures/keiyaku-test.html'))
          .toString('utf8'));
      cb();
    }));
});

test('Basic Template Rendering', done => {
  markdownStream(path.join(__dirname, './fixtures/ipsum.md'))
    .pipe(renderHtml({
      tplDir: path.join(TEMPLATE_DIR, 'default'),
    })).pipe(through((chunk: Buffer, enc, cb) => {
      expect(enc).toBe('buffer');
      expect(chunk).toEqual(
        fs.readFileSync(path.join(__dirname, './fixtures/ipsum-in-template.html')),
      );
      cb();
      // fs.writeFileSync(path.join(__dirname, './fixtures/ipsum-in-template.html'), chunk);
    }));
});
