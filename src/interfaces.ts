import * as stream from 'stream';

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

export interface Style {
  text: string;
  paths: string;
  filename: string;
  compress: false;
}

/**
 * @TODO: split Mandoc Options into a group of options interfaces union.
 */
export interface CmdMandocOptions {
  template: string;
  tableOfContents: boolean;
  output: string;
  watch: boolean;
  build: OutputBuild;
}

export interface TemplateConfiguration {
  /**
   * The primary entry point to the template usage.
   * `layout/template.njk` is default.
   */
  main: string;

  /**
   * The primary directory where styles files are stored.
   * `css`, `less` files are all supported.
   *
   * `source/` directory is default.
   */
  cssBaseDir?: string;

  /**
   * The primary directory where javascript script files are stored.
   *
   * `source/` directory is default.
   */
  jsBaseDir?: string;
  renderer?: (register:
    (name: string, output: string, processStream: stream.Transform) => void,
    // tplCtx: Context // Plan in the future for support getting mandoc context
    //                    in processStream.
  ) => void;
  helper?: (register:
    (name: string, fn: (...args: (string | Object)[]) => string) => void,
  ) => void;
}

export enum OutputBuild {
  StandaloneFile,
  Site,
  Webpack,
}
