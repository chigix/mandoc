import * as path from 'path';

export const DOCS_APP_PROJECT_ROOT = path.resolve(__dirname, '../');
export const CONTENTS_PATH = path.resolve(DOCS_APP_PROJECT_ROOT, 'content');
export const SRC_PATH = path.resolve(DOCS_APP_PROJECT_ROOT, 'src');
export const OUTPUT_PATH = path.resolve(SRC_PATH, 'generated');
export const DOCS_OUTPUT_PATH = path.resolve(OUTPUT_PATH, 'docs');
