import * as _ from 'lodash';
import { getConfig } from 'mandoc/scripts/template.config';
import * as path from 'path';
import { TPL_TEST_FIXTURE } from './constants';
const builtin_paper_cfg = require.resolve('mandoc-template-paper');

describe('getConfig', () => {
  it('Returns paper template config object', () => {
    const real_ctx = getConfig('mandoc-template-paper', {
      paperWidth: 446,
      paperHeight: 446,
    });
    expect(real_ctx.rootDir).toBe(path.dirname(builtin_paper_cfg));
    expect(real_ctx.main).toBe('./layout/template.njk');
    expect(real_ctx.cssBaseDir).toBe('./source');
    expect(real_ctx.jsBaseDir).toBe('./source');
  });
  it('Returns [import-render-case] template config object', () => {
    const real_ctx = getConfig(
      path.resolve(TPL_TEST_FIXTURE, 'import-render-case'),
      {
        paperWidth: 446,
        paperHeight: 446,
      },
    );
    expect(real_ctx.rootDir).toBe(path.resolve(TPL_TEST_FIXTURE, 'import-render-case'));
    expect(real_ctx.main).toBe('./layout/template.njk');
    expect(real_ctx.cssBaseDir).toBe('./source');
  });
  it('Throws Error for unavailable package name', () => {
    expect(() => getConfig('unknown-package-name', {
      paperWidth: 446,
      paperHeight: 446,
    })).toThrowError('Could not find a config file based on provided values:');
  });
  it('Throws Error for no available mandoc.config file', () => {
    expect(function () {
      return getConfig(path.resolve(TPL_TEST_FIXTURE, 'empty-folder-case'), {
        paperWidth: 446,
        paperHeight: 446,
      });
    }).toThrowError('Could not find a config file based on provided values:');
  });
});
