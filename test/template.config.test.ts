import * as _ from 'lodash';
import { DEFAULT_CONVERTER_OPTS } from '../src/commanders';
import { readConfig } from '../src/scripts/template.config';
import { FIXTURES_DIR } from './constants';

test('Error in passing template config object', () => {
  expect(() => {
    readConfig(undefined, {
      main: './fixtures/not-existed.html',
    });
  }).toThrowError('Mandoc: Cannot use configuration as an object without a file path.');
});

test('No Template Option in Cmd', () => {
  const default_config = readConfig(DEFAULT_CONVERTER_OPTS);
  expect(default_config.main).toBe('./layout/template.njk');
  expect(default_config.cssBaseDir).toBe('./source');
  expect(default_config.jsBaseDir).toBe('./source');
});
