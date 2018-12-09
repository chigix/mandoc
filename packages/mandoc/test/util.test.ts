import { PrintContext } from 'mandoc/interfaces';
import { generatePrintContext, urlFor } from 'mandoc/lib/util';
import * as path from 'path';

const slash: (path: string) => string = require('slash');

const TEMPLATE_DIR = path.dirname(require.resolve('mandoc-template-paper'));

test('TEMPLATE_DIR', () => {
  expect(slash(TEMPLATE_DIR).endsWith('packages/tpl-paper/dist')).toBe(true);
});

test('Basic urlFor cases', () => {
  expect(urlFor('/main.js', {
    baseDir: path.join(TEMPLATE_DIR, 'layout'),
    rootDir: path.join(TEMPLATE_DIR, 'source'),
  })).toBe('/main.js');
  expect(urlFor('style.css', {
    baseDir: path.join(TEMPLATE_DIR, 'layout'),
    rootDir: path.join(TEMPLATE_DIR, 'source'),
  })).toBe('/style.css');
  expect(urlFor('https://cdnjs.cloudflare.com'
    + '/ajax/libs/mathjax/2.7.1/MathJax.js'
    + '?config=TeX-AMS_HTML&delayStartupUntil=configured', {
      baseDir: path.join(TEMPLATE_DIR, 'layout'),
      rootDir: path.join(TEMPLATE_DIR, 'source'),
    })).toBe('https://cdnjs.cloudflare.com'
      + '/ajax/libs/mathjax/2.7.1/MathJax.js'
      + '?config=TeX-AMS_HTML&delayStartupUntil=configured');
  expect(urlFor('bankai', {
    baseDir: TEMPLATE_DIR,
    rootDir: TEMPLATE_DIR,
  })).toBe('/bankai');
});

test('Print Context Generator', () => {
  expect(generatePrintContext('A4')).toEqual({
    pageSize: 'A4',
    paperOrientation: 'portrait',
    paperWidth: 210,
    paperHeight: 297,
  } as PrintContext);
  expect(generatePrintContext('A3')).toEqual({
    pageSize: 'A3',
    paperOrientation: 'portrait',
    paperWidth: 297,
    paperHeight: 420,
  } as PrintContext);
});
