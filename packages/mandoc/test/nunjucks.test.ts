import * as fs from 'fs';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import {
  RENDER_CASE_FIXTURE,
  TPL_TEST_FIXTURE,
} from './constants';
const NjkLoaders = require('mandoc/lib/njk-loader');

function getNJKEnv(tplDir: string | string[]) {
  return new nunjucks.Environment(
    new NjkLoaders.TemplateLoader(tplDir));
}

test('TemplateLoader Basic Usage', done => {
  getNJKEnv(path.join(TPL_TEST_FIXTURE, './basic-render-case'))
    .render('layout/template.njk', {
      title: '逃げる',
      body: '逃げちゃだめだ。逃げちゃだめだ。逃げちゃだめだ。',
    }, (err, result) => {
      expect(err).toBeNull();
      if (err) {
        console.error(err);
      }
      expect(result).toEqual(
        fs.readFileSync(
          path.resolve(RENDER_CASE_FIXTURE, './basic-render-nigeru.html'),
          'utf8'));

      return done();
    });
});

test('Basic External Source Import Testing', done => {
  getNJKEnv([
    path.join(TPL_TEST_FIXTURE, './import-render-case'),
    path.join(TPL_TEST_FIXTURE, './import-render-case/source'),
  ]).render('layout/template.njk', {
    title: '逃げる',
    body: '逃げちゃだめだ。逃げちゃだめだ。逃げちゃだめだ。',
    styleIncludes: [
      'style.css',
    ],
  }, (err, result) => {
    expect(err).toBeNull();
    expect(result).toEqual(
      fs.readFileSync(
        path.resolve(RENDER_CASE_FIXTURE, './import-render-nigeru.html')
        , 'utf8'));

    return done();
  });
});

test('Import Normalize Css', done => {
  getNJKEnv([
    path.join(TPL_TEST_FIXTURE, './import-render-case'),
  ]).render('layout/template.njk', {
    title: '守る',
    body: 'あなたは死なないわ。私が守るもの',
    styleIncludes: [
      require.resolve('normalize.css'),
    ],
  }, (err, result) => {
    expect(err).toBeNull();
    expect(result).toEqual(
      expect.stringContaining(
        fs.readFileSync(require.resolve('normalize.css'), 'utf8')));

    return done();
  });
});
