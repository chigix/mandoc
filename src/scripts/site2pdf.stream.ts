import * as fs from 'fs-extra';
import * as path from 'path';
import * as phantom from 'phantom';
import * as stream from 'stream';
import * as through from 'through2';
import * as tmp from 'tmp';
import { SiteBuildContext } from '../interfaces';
const phantom_path = require('phantomjs-prebuilt').path;

/**
 * HTML Site Package --> PDF Bytes Stream
 *
 * @export
 * @returns {stream.Transform}
 */
export default function renderPdf(): stream.Transform {
  return through.obj(async function (site: SiteBuildContext, enc, flush) {
    const through_scope = this;
    const phantom_instance = await phantom.create([], {
      phantomPath: phantom_path,
    });
    const page = await phantom_instance.createPage();
    page.on('onLoadFinished', () => {
      tmp.file((err, path, fd, cleanupCallback) => {
        if (err) {
          console.error(err);
          flush(err);
        }
        page.render(path, { format: 'pdf' }).then(function onResolve() {
          page.close();
          through_scope.push(fs.readFileSync(path));
          fs.removeSync(path);
          cleanupCallback();
          site.cleanupCallback();
          flush();
        });
      });
    });
    const index_path = path.resolve(site.rootDir, site.index);
    // @TODO: `file:///` need to be tested on different OS.
    const page_status = await page.open(
      'file:///' + index_path,
      { operation: 'GET', encoding: 'utf8' },
    );
    if (page_status != 'success') {
      return flush(new Error(`Unable to load temp file: ${index_path}`));
    }
  });
}
