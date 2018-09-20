import * as stream from 'stream';

export type Path = string;
export type Glob = string;

/** Descriptor Interface */

/**
 * Abstract Descriptor for inputted document source,
 * mostly to be converted or parsed in later processes.
 *
 * TODO: rename to `DocumentDescriptor`
 */
export interface Doc {
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
  // TODO: with writingFormat instead
  build: OutputBuild;
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
  renderer?: (register:
    (name: string, output: string, processStream: stream.Transform) => void,
    // tplCtx: Context // Plan in the future for support getting mandoc context
    //                    in processStream.
  ) => void;
  helper?: (register:
    (name: string, fn: (...args: (string | Object)[]) => string) => void,
  ) => void;
}

/** Preset Enums */

export enum OutputBuild {
  StandaloneFile,
  Site,
  Webpack,
}

/** Context Interface */

export interface SiteBuildContext {
  rootDir: Path;
  index: string;
  cleanupCallback: () => void;
}
