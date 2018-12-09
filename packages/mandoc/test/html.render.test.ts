import { FIXTURES_DIR } from '@fixtures';
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
  markdownStream(
    path.join(FIXTURES_DIR, './ipsum.md'),
  ).pipe(through.obj((report: DocumentDescriptor, enc, cb) => {
    expect(report.body).toBe(
      fs.readFileSync(path.join(FIXTURES_DIR, './ipsum.html'))
        .toString('utf8'));
  }));
  markdownStream(
    path.join(FIXTURES_DIR, './keiyaku-test.md'),
  ).pipe(through.obj((report: DocumentDescriptor, enc, cb) => {
    expect(report.body).toBe(
      fs.readFileSync(path.join(FIXTURES_DIR, './keiyaku-test.html'))
        .toString('utf8'));
    cb();
  }));
});

test('Basic Template Rendering', done => {
  markdownStream(
    path.join(FIXTURES_DIR, './ipsum.md'),
  ).pipe(
    getConfig(TPL_PKG_ALIASES.default, {
      paperWidth: 446,
      paperHeight: 446,
    }).renderers.njk.stream,
  ).pipe(through((chunk: Buffer, enc, cb) => {
    expect(enc).toBe('buffer');
    expect(chunk).toEqual(
      fs.readFileSync(path.join(FIXTURES_DIR, './ipsum-in-template.html')),
    );
    // console.log(fs.readFileSync(path.join(TEST_FIXTURE, './ipsum-in-template.html')).length);
    // console.log(chunk.length);
    // fs.writeFileSync(path.join(TEST_FIXTURE, './ipsum-in-template.html'), chunk);
    cb();
    done();
  }));
});
