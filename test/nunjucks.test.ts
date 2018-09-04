import * as fs from 'fs';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import * as CONST from './constants';
const NjkLoaders = require('../tools/njk-loader');

test('TemplateLoader Basic Usage', done => {
  const njk_env = new nunjucks.Environment(
    new NjkLoaders.TemplateLoader(path.join(CONST.TEST_TEMPLATE_DIR, './basic-render-case')),
    // new nunjucks.FileSystemLoader(path.join(CONST.TEST_TEMPLATE_DIR, './basic-render-case')),
  );
  njk_env.render('layout/template.njk', {
    title: '逃げる',
    body: '逃げちゃだめだ。逃げちゃだめだ。逃げちゃだめだ。',
  }, (err, result) => {
    expect(err).toBeNull();
    if (err) {
      console.error(err);
    }
    expect(result).toEqual(
      fs.readFileSync(
        path.resolve(CONST.RENDER_CASE_DIR, './basic-render-nigeru.html'),
        'utf8'));

    return done();
  });
});
