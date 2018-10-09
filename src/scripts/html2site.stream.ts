import * as fs from 'fs-extra';
import * as path from 'path';
import * as stream from 'stream';
import * as through from 'through2';
import * as tmp from 'tmp';
import { SiteBuildContext, TemplateContext } from '../interfaces';

/**
 * Html Stream --> Site Object
 *
 * @export
 * @param {TemplateContext} tplCtx
 * @returns {stream.Transform}
 */
export default function SiteWrapper(tplCtx: TemplateContext): stream.Transform {
  let html = '';

  return through.obj((chunk: Buffer, enc, flush) => {
    html += chunk;
    flush();
  }, function flush(cb) {
    tmp.dir((err, tmp_dir, cleanupCallback) => {
      fs.copySync(tplCtx.rootDir, tmp_dir, { recursive: false });
      if (tplCtx.cssBaseDir) {
        fs.copySync(
          path.resolve(tplCtx.rootDir, tplCtx.cssBaseDir),
          tmp_dir, { recursive: false });
      }
      if (tplCtx.jsBaseDir) {
        fs.copySync(
          path.resolve(tplCtx.rootDir, tplCtx.jsBaseDir),
          tmp_dir, { recursive: false });
      }
      fs.removeSync(path.resolve(tmp_dir, './index.html'));
      fs.writeFileSync(path.resolve(tmp_dir, './index.html'), html);
      this.push({
        rootDir: tmp_dir,
        index: 'index.html',
        cleanupCallback: () => {
          fs.removeSync(tmp_dir);
        },
      } as SiteBuildContext);
      cb();
    });
  });
}
