import * as _ from 'lodash';
import * as path from 'path';
import * as pptr from 'puppeteer';
import * as stream from 'stream';
import * as through from 'through2';
import { SiteBuildContext } from '../interfaces';
import { TemplateFileError } from '../lib/errors';

/**
 * HTML Site Package --> PDF Bytes Stream
 *
 * @export
 * @returns {stream.Transform}
 */
export default function createPDFRenderStream(): stream.Transform {
  return through.obj(async function (site: SiteBuildContext, enc, flush) {
    const browser = await pptr.launch();
    const page = await browser.newPage();
    // TODO: `file:///` need to be tested on different OS.
    if (_.isNull(await page.goto('file:///' + path.resolve(site.rootDir, site.index)))) {
      return flush(new TemplateFileError(
        `Unable to load temp file: ${path.resolve(site.rootDir, site.index)}`));
    }

    return page.pdf({
      format: 'A4',
    }).then(buffer => {
      return this.push(buffer);
    }).then(() => {
      return browser.close();
    }).then(() => {
      site.cleanupCallback();
      flush();
    });
  });
}
