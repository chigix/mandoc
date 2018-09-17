import * as path from 'path';
import { TEMPLATE_DIR } from './paths.fix';

export * from './paths.fix';

export const TPL_DEFAULT_ROOT = path.join(TEMPLATE_DIR, 'default');
export const TPL_KEIYAKU_ROOT = path.join(TEMPLATE_DIR, 'keiyaku');
export const TPL_CFG_SOURCE = 'source';
export const TPL_CFG_MAIN_FILE = 'layout/template.njk';
export const PACKAGE_JSON = 'package.json';
export const TPL_CFG_PATH = 'mandoc.config.js';
