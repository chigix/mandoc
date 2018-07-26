import * as fs from 'fs';
import * as path from 'path';
import * as Remarkable from 'remarkable';
import * as tmp from 'tmp';

test('Parse ipsum.md', done => {
  tmp.file({ postfix: '.pdf' }, (err, tmpPdfPath, tmpPdfFd, cleanup) => {
    console.log(tmpPdfPath);
    if (err) { throw err; }
    fs.closeSync(tmpPdfFd);
    const md = new Remarkable({
      html: true,
      xhtmlOut: false,
      breaks: false,
      langPrefix: 'language-',
      linkify: true,
    });
    fs.readFile(path.join(__dirname, './fixtures/ipsum.md'), 'utf8', (err, data_md) => {
      if (err) { throw err; }
      fs.readFile(path.join(__dirname, './fixtures/ipsum.html'), 'utf8', (err, data_html) => {
        if (err) { throw err; }
        expect(md.render(data_md)).toBe(data_html);
        cleanup();
        done();
      });
    });
  });
});

