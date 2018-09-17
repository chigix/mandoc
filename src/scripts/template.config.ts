import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';
import * as stream from 'stream';
import * as through from 'through2';
import { CmdMandocOptions, TemplateConfiguration } from '../interfaces';
import { isFile, jsonlintErrCatch } from '../lib/util';
import {
  PACKAGE_JSON,
  TEMPLATE_DIR,
  TPL_CFG_MAIN_FILE,
  TPL_CFG_PATH,
  TPL_CFG_SOURCE,
  TPL_DEFAULT_ROOT,
} from '../paths.const';
import { renderMarkdown } from './md2html.stream';
import { NJK_STREAM_FACTORY } from './template.stream';
const requireg = require('requireg');

export interface Context extends TemplateConfiguration
  , RegisterExtensionContext {
  /**
   * The root directory of the template package.
   *
   * Default: The root of the directory containing the template's config
   * file or the `package.json` or the [pwd](https://en.wikipedia.org/wiki/Pwd)
   * if no `package.json` is found.
   */
  rootDir: string;
}

export interface RegisterExtensionContext {
  renderers: {
    [name: string]: {
      output: string,
      stream: stream.Transform,
    } | undefined,
    'njk': {
      output: 'html',
      stream: stream.Transform,
    },
    'md'?: {
      output: 'html',
      stream: stream.Transform,
    },
  };

  helpers: { [name: string]: (...args: (string | Object)[]) => string };
}

function configToContext(
  configuration: TemplateConfiguration, opts: {
    configFile: string,
  }): Context {
  // @TODO: Validate configuration.
  const tpl_ctx = _.assign({
    rootDir: path.dirname(opts.configFile),
    main: TPL_CFG_MAIN_FILE,
    cssBaseDir: TPL_CFG_SOURCE,
    jsBaseDir: TPL_CFG_SOURCE,
  } as Context, configuration);

  const register: RegisterExtensionContext = {
    renderers: {
      njk: {
        output: 'html', stream: through(),
      },
    },
    helpers: {},
  };

  register.renderers.njk = {
    output: 'html', stream: NJK_STREAM_FACTORY(tpl_ctx, register),
  };

  register.renderers.md = {
    output: 'html', stream: renderMarkdown({ baseDir: tpl_ctx.rootDir }),
  };

  if (configuration.renderer) {
    configuration.renderer(
      /**
       * Learned from Hexo extension design
       * https://github.com/hexojs/hexo/blob/master/lib/extend/renderer.js
       */
      function reg(name, output, processStream) {
        register.renderers[name] = {
          output: output,
          stream: processStream,
        };
      });
  }
  if (configuration.helper) {
    configuration.helper(
      /**
       * Learned from Hexo extension design
       * https://github.com/hexojs/hexo/blob/master/lib/extend/helper.js
       */
      function reg(name, helper) {
        register.helpers[name] = helper;
      });
  }

  return _.assign(tpl_ctx, register);
}

function resolveConfigPathByTraversing(
  pathToResolve: string, initialPath: string, cwd: string)
  : string {
  const js_config = path.resolve(pathToResolve, TPL_CFG_PATH);
  if (isFile(js_config)) {
    return js_config;
  }

  const package_json = path.resolve(pathToResolve, PACKAGE_JSON);
  if (isFile(package_json)) {
    return package_json;
  }

  (function checkIfSystemRootReached() {
    if (pathToResolve === path.dirname(pathToResolve)) {
      throw new Error('Could not find a config file based on provided values:\n' +
        `path: "${initialPath}"\n` +
        `cwd: "${cwd}"\n` +
        'Config paths must be specified by either a direct path to a config\n' +
        'file, or a path to a directory. If directory is given, Mandoc will try to\n' +
        `traverse directory tree up, until it finds either "${TPL_CFG_PATH}" or\n` +
        `"${PACKAGE_JSON}".`);
    }
  })();


  return resolveConfigPathByTraversing(
    path.dirname(pathToResolve), initialPath, cwd);
}

function resolveConfigPath(pathToResolve: string, cwd: string) {
  if (!path.isAbsolute(cwd)) {
    throw new Error(`"cwd" must be an absolute path. cwd: ${cwd}`);
  }
  const absolute_path = path.isAbsolute(pathToResolve)
    ? pathToResolve
    : path.resolve(cwd, pathToResolve);
  if (isFile(absolute_path)) {
    return absolute_path;
  }

  return resolveConfigPathByTraversing(absolute_path, pathToResolve, cwd);
}

/**
 * Read the configuration
 * 1. If it's a `package.json` file, we look into its "mdTemplate" property
 * 2. For any other file, we just require it.
 *
 * @param configPath The configuration file path.
 */
function readConfigFile(configPath: string): TemplateConfiguration {
  const isJSON = configPath.endsWith('.json');
  let configObject;

  try {
    configObject = require(configPath);
  } catch (error) {
    if (isJSON) {
      throw new Error(
        `Mandoc: Failed to parse config file ${configPath}\n` +
        `  ${jsonlintErrCatch(fs.readFileSync(configPath, 'utf8'))}`,
      );
    } else {
      throw error;
    }
  }

  if (configPath.endsWith(PACKAGE_JSON)) {
    configObject = configObject || {};
  }

  return configObject;
}

/**
 * Learned from the facebook/jest configuration resolver and reader code.
 *
 * https://github.com/facebook/jest/blob/master/packages/jest-config/src/index.js
 *
 * @TODO: refine the options needed here much more specifically instead of
 * using the whole cmdOpts directly.
 *
 * @param cmdOpts options set object from commander
 * @param templatePackageRoot base directory path of the target template.
 * @param parentConfigPath Configuration file path.
 */
export function readConfig(
  cmdOpts?: CmdMandocOptions,
  templateConfig?: TemplateConfiguration,
  parentConfigPath?: string,
): Context {
  let raw_options: TemplateConfiguration;
  let config_path;

  if (templateConfig) {
    if (parentConfigPath) {
      config_path = parentConfigPath;
      raw_options = templateConfig;
    } else {
      throw new Error(
        'Mandoc: Cannot use configuration as an object without a file path.',
      );
    }
  } else if (!cmdOpts) {
    throw new Error(
      'UnexpectedError: command options not received.',
    );
  } else if (typeof cmdOpts.template === 'string') {
    try {
      config_path = requireg.resolve(cmdOpts.template);
    } catch (error) {
      config_path = null;
    }
    if (!config_path) {
      try {
        config_path = require.resolve(cmdOpts.template);
      } catch (error) {
        config_path = null;
      }
    }
    if (!config_path) {
      config_path = path.resolve(TEMPLATE_DIR, cmdOpts.template);
      if (!fs.existsSync(config_path)) {
        config_path = cmdOpts.template;
      }
    }
    // A string passed to `--template`, which is either a direct path or
    // a path to directory containing `package.json` or `mandoc.config.js`
    config_path = resolveConfigPath(config_path, process.cwd());
    raw_options = readConfigFile(config_path);
  } else {
    config_path = resolveConfigPath(TPL_DEFAULT_ROOT, TEMPLATE_DIR);
    raw_options = readConfigFile(config_path);
  }

  return configToContext(raw_options, {
    configFile: config_path,
  });
}

export function getConfig(cmdOpts: CmdMandocOptions): Context {
  return readConfig(cmdOpts);
}
