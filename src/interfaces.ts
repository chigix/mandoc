import * as stream from 'stream';

export type Path = string;
export type Glob = string;

/** Descriptor Interface */

/**
 * Abstract Descriptor for inputted document source,
 * mostly to be converted or parsed in later processes.
 */
export interface DocumentDescriptor {
  title: string;
  author?: {
    name: string,
    email?: string,
    address?: string,
    desc?: string,
  }[];
  body: string;
  bibliography?: {}[];
}

/**
 * Designed for Compiling LESS/SASS source files.
 *
 * TODO: still necessary? or remove later?
 */
export interface Style {
  text: string;
  paths: Path[];
  filename: string;
  compress: false;
}

/** Configuration Interface */

export interface CmdMandocOptions
  extends CmdMandocOptionsTplConf {
  from: 'markdown' | string;
  to: 'pdf' | string;
  /**
   * Whether to show tableOfContents in Document Compiling.
   *
   * @type {boolean}
   * @memberof CmdMandocOptions
   */
  tableOfContents: boolean;
  output: Path;
  watch: boolean;
  'print.pageSize'?: string;
}

export interface CmdMandocOptionsTplConf {
  /**
   * @type {string}
   * @memberof CmdMandocOptionsTplConf
   *
   * - Template name
   * - path to the template directory
   */
  template: string;
}

export interface TemplateConfiguration {
  /**
   * The primary entry point to the template usage.
   * `layout/template.njk` is default.
   */
  main: Path;

  /**
   * The primary directory where styles files are stored.
   * `css`, `less` files are all supported.
   *
   * `source/` directory is default.
   */
  cssBaseDir?: Path;

  /**
   * The primary directory where javascript script files are stored.
   *
   * `source/` directory is default.
   */
  jsBaseDir?: Path;
  /**
   * If true, render page with the size declared in the template CSS,
   * otherwise use the options in `CmdMandocOptionsPrintConf`.
   * Default is false.
   *
   * @type {boolean}
   * @memberof TemplateConfiguration
   */
  preferCssPageSize: boolean;
  renderer?: (register:
    (name: string, output: string, processStream: stream.Transform) => void,
    // tplCtx: Context // Plan in the future for support getting mandoc context
    //                    in processStream.
  ) => void;
  helper?: (register:
    (name: string, fn: (...args: (string | Object)[]) => string) => void,
  ) => void;
}

/** Context Interface */

export interface TemplateContext extends TemplateConfiguration
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

export interface SiteBuildContext {
  rootDir: Path;
  index: string;
  cleanupCallback: () => void;
}

export interface PrintContext {
  pageSize?: 'Letter' | 'Legal' | 'Tabload' | 'Ledger'
  | 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5';
  paperWidth: number; // millimeter
  paperHeight: number; // millimeter
  paperOrientation?: 'portrait' | 'landscape';
}
