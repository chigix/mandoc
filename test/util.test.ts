import * as path from 'path';
import { urlFor } from '../src/lib/util';
import { TEMPLATE_DIR } from './constants';

test('Basic urlFor cases', () => {
  expect(urlFor('/main.js', {
    baseDir: path.join(TEMPLATE_DIR, 'default/layout'),
    rootDir: path.join(TEMPLATE_DIR, 'default/source'),
  })).toBe('/main.js');
  expect(urlFor('style.css', {
    baseDir: path.join(TEMPLATE_DIR, 'default/layout'),
    rootDir: path.join(TEMPLATE_DIR, 'default/source'),
  })).toBe('/style.css');
  expect(urlFor('https://cdnjs.cloudflare.com'
    + '/ajax/libs/mathjax/2.7.1/MathJax.js'
    + '?config=TeX-AMS_HTML&delayStartupUntil=configured', {
      baseDir: path.join(TEMPLATE_DIR, 'default/layout'),
      rootDir: path.join(TEMPLATE_DIR, 'default/source'),
    })).toBe('https://cdnjs.cloudflare.com'
      + '/ajax/libs/mathjax/2.7.1/MathJax.js'
      + '?config=TeX-AMS_HTML&delayStartupUntil=configured');
  expect(urlFor('bankai', {
    baseDir: TEMPLATE_DIR,
    rootDir: TEMPLATE_DIR,
  })).toBe('/bankai');
});
