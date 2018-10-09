import * as _ from 'lodash';
import { readConfig } from 'mandoc/scripts/template.config';

test('Error when reading templateConfig without configPath', () => {
  expect(() => {
    readConfig(undefined, {
      main: './fixtures/not-existed.html',
    });
  }).toThrowError(
    'Mandoc: Cannot use configuration as an object without a file path.');
});

test('Read Template Config through CmdOption', () => {
  const default_config = readConfig({
    template: 'default',
  });
  expect(default_config.main).toBe('./layout/template.njk');
  expect(default_config.cssBaseDir).toBe('./source');
  expect(default_config.jsBaseDir).toBe('./source');
});
