import * as stream from 'stream';
import { DEFAULT_CONVERTER_OPTS } from './commanders';

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

export type ConvertCommandOptions = typeof DEFAULT_CONVERTER_OPTS;

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
  ) => never;
  helper?: (register:
    (name: string, fn: (...args: (string | Object)[]) => string) => never,
  ) => never;
}
