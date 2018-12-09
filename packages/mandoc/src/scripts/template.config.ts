import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';
import * as through from 'through2';
import {
  Path,
  PrintContext,
  RegisterExtensionContext,
  TemplateConfiguration,
  TemplateContext,
} from '../interfaces';
import { TemplateFileError } from '../lib/errors';
import { isFile, jsonlintErrCatch } from '../lib/util';
import {
  TPL_CFG_FILE_PATH,
  TPL_CFG_JSON_PATH,
  TPL_DEFAULT_LAYOUT_FILE,
} from '../paths.const';
import { renderMarkdown } from './md2html.stream';
import { NJK_STREAM_FACTORY } from './template.stream';
const requireg = require('requireg');
const slash = require('slash');

class InvalidTemplatePackageError extends Error { }

/**
 * Calculate Context Object upon a Template Config Object.
 *
 * @param configuration
 * @param opts
 * @internal
 */
function configToContext(
  configuration: TemplateConfiguration, opts: {
    configFile: string,
    print: PrintContext,
  }): TemplateContext {
  // TODO: Validate configuration.
  const tpl_ctx = _.assign({
    rootDir: path.dirname(opts.configFile),
    main: TPL_DEFAULT_LAYOUT_FILE,
    preferCssPageSize: false,
  } as TemplateContext, configuration);

  const register: RegisterExtensionContext = {
    renderers: {
      njk: {
        output: 'html', stream: through(),
      },
    },
    helpers: {},
  };

  register.renderers.njk = {
    output: 'html', stream: NJK_STREAM_FACTORY(tpl_ctx, opts.print, register),
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

/**
 * Find and Resolve ManDoc Template Configuration Like file from a given
 * directory.
 *
 * 1. If it's a `package.json` file, and `mandoc.config` file is given
 *    in the `main` field, then this file would be return.
 * 2. For any other file, we just return it for the require later in
 * `readConfigFile`.
 *
 * @param {string} pathToResolve
 * @param {string} initialPath
 * @param {string} cwd
 */
function resolveConfigPathByTraversing(
  pathToResolve: string, initialPath: string, cwd: string)
  : Path {

  if (!fs.existsSync(pathToResolve)) {
    throw new InvalidTemplatePackageError(`Cannot find template '${pathToResolve}'.`);
  }

  const package_json_file = path.resolve(pathToResolve, 'package.json');
  if (isFile(package_json_file)) {
    try {
      const packageJson = require(package_json_file);
      if (packageJson.main
        && isFile(path.resolve(pathToResolve, packageJson.main))) {
        return path.resolve(pathToResolve, packageJson.main);
      }
    } catch (error) {
      throw new TemplateFileError(
        `Main Field is unavailable on the package.json: ${package_json_file}`);
    }
  }

  const js_config = path.resolve(pathToResolve, TPL_CFG_FILE_PATH);
  if (isFile(js_config)) {
    return js_config;
  }

  const json_config = path.resolve(pathToResolve, TPL_CFG_JSON_PATH);
  if (isFile(json_config)) {
    return json_config;
  }


  (function checkIfSystemRootReached() {
    if (pathToResolve === path.dirname(pathToResolve)) {
      throw new InvalidTemplatePackageError(
        'Could not find a config file based on provided values:\n' +
        `path: "${initialPath}"\n` +
        `cwd: "${cwd}"\n` +
        'Config paths must be specified by either a direct path to a config\n' +
        'file, or a path to a directory. If directory is given, Mandoc will try to\n' +
        `traverse directory tree up, until it finds either "${TPL_CFG_FILE_PATH}" or\n` +
        ` or ${TPL_CFG_JSON_PATH} or "package.json".`);
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

  return configObject;
}

/**
 * Get Configured Context for specified template package.
 *
 * @param template_name Template Package name or the path to the template directory.
 */
export function getConfig(template_name: string, print_ctx: PrintContext): TemplateContext {
  if (requireg.resolve(template_name)) {
    return configToContext(require(template_name), {
      configFile: requireg.resolve(template_name),
      print: print_ctx,
    });
  }
  const file = slash(resolveConfigPath(template_name, process.cwd()));
  const raw_options = readConfigFile(file);

  return configToContext(raw_options, {
    configFile: file,
    print: print_ctx,
  });
}
