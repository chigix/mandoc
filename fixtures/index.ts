import * as fs from 'fs-extra';
import * as path from 'path';
const slash = require('slash');

type Path = string;

export const FIXTURES_DIR = slash(__dirname);
export const TPL_TEST_FIXTURE = slash(path.join(FIXTURES_DIR, './tpl-test'));
export const RENDER_CASE_FIXTURE = slash(path.join(FIXTURES_DIR, './tpl-render-result'));

export function fixture(name: Path) {
  return slash(path.resolve(FIXTURES_DIR, name));
}

export function readFixture(name: Path) {
  return fs.readFileSync(path.resolve(FIXTURES_DIR, name), 'utf8');
}
