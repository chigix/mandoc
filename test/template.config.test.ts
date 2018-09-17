import * as _ from 'lodash';
import { OutputBuild } from 'mandoc/interfaces';
import { readConfig } from 'mandoc/scripts/template.config';
import { TEST_FIXTURE } from './constants';

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
    tableOfContents: false,
    watch: false,
    build: OutputBuild.StandaloneFile,
    output: './output.temp.html',
  });
  expect(default_config.main).toBe('./layout/template.njk');
  expect(default_config.cssBaseDir).toBe('./source');
  expect(default_config.jsBaseDir).toBe('./source');
});
