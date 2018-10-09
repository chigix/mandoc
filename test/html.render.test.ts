import * as fs from 'fs';
import { DocumentDescriptor } from 'mandoc/interfaces';
import { TEMPLATE_DIR } from 'mandoc/paths.const';
import { renderMarkdown } from 'mandoc/scripts/md2html.stream';
import { readConfig as tplCfg } from 'mandoc/scripts/template.config';
import * as path from 'path';
import * as through from 'through2';
import { TEST_FIXTURE } from './constants';
const slash = require('slash');

function markdownStream(file: string) {
  return fs.createReadStream(file)
    .pipe(renderMarkdown({
      baseDir: path.dirname(file),
    }));
}

test('Basic RenderMarkdown', () => {
  markdownStream(
    path.join(TEST_FIXTURE, './ipsum.md'),
  ).pipe(through.obj((report: DocumentDescriptor, enc, cb) => {
    expect(report.body).toBe(
      fs.readFileSync(path.join(TEST_FIXTURE, './ipsum.html'))
        .toString('utf8'));
  }));
  markdownStream(
    path.join(TEST_FIXTURE, './keiyaku-test.md'),
  ).pipe(through.obj((report: DocumentDescriptor, enc, cb) => {
    expect(report.body).toBe(
      fs.readFileSync(path.join(TEST_FIXTURE, './keiyaku-test.html'))
        .toString('utf8'));
    cb();
  }));
});

test('Basic Template Rendering', done => {
  markdownStream(
    path.join(TEST_FIXTURE, './ipsum.md'),
  ).pipe(
    tplCfg(
      undefined, {
        main: 'layout/template.njk',
        helper: (register) => {
          register('normalizeCSS', slash(require.resolve('normalize.css')));
        },
      }, path.join(TEMPLATE_DIR, 'default/mandoc.config.js'),
    ).renderers.njk.stream,
  ).pipe(through((chunk: Buffer, enc, cb) => {
    expect(enc).toBe('buffer');
    expect(chunk).toEqual(
      fs.readFileSync(path.join(TEST_FIXTURE, './ipsum-in-template.html')),
    );
    // console.log(fs.readFileSync(path.join(TEST_FIXTURE, './ipsum-in-template.html')).length);
    // console.log(chunk.length);
    // fs.writeFileSync(path.join(TEST_FIXTURE, './ipsum-in-template.html'), chunk);
    cb();
    done();
  }));
});
