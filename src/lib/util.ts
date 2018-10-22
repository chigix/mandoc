import * as fs from 'fs';
import * as mathjs from 'mathjs';
import * as path from 'path';
import { isString } from 'util';
import { PrintContext } from '../interfaces';
import { MandocCommandOptionError } from './errors';
const slash = require('slash');
const jsonlint = require('jsonlint');

/**
 * Should only be used in site mode.
 *
 * @param p target file path
 * @param ctx
 */
export function urlFor(p: string, ctx: {
  baseDir: fs.PathLike,
  rootDir: fs.PathLike,
}): string {
  if (p.startsWith('http://') || p.startsWith('https://')) {
    return p;
  }
  const root_dir_path = isString(ctx.rootDir) ?
    ctx.rootDir : ctx.rootDir.toString();
  const base_dir_path = isString(ctx.baseDir) ?
    ctx.baseDir : ctx.baseDir.toString();
  if (isFile(path.join(root_dir_path, p))) {
    return slash(p).startsWith('/') ? slash(p) : slash(path.join('/', p));
  }

  return slash(path.join('/', path.relative(
    root_dir_path, path.join(base_dir_path, p),
  )));
}

export function isJSONString(text: string) {
  return text.startsWith('{') &&
    text.endsWith('}');
}

export function isFile(filePath: fs.PathLike) {
  return fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory();
}

export function jsonlintErrCatch(input: string) {
  try {
    jsonlint.parse(input);
  } catch (error) {
    return error.stack;
  }
}

/**
 * Learned from
 * https://github.com/hexojs/hexo/commit/2ad42b3501554ce48401c09ee3b4158d4b6e38f7#diff-5b9787c2de58e4aa04138e83d461159eL20
 *
 * @param file
 */
export function extName(file: string) {
  const extname = path.extname(file);

  return extname[0] === '.' ? extname.slice(1) : extname;
}

namespace PrintContextGenerator {
  // https://developer.mozilla.org/en-US/docs/Web/CSS/@page/size#Values
  const PAPER_FORMATS: {
    [key: string]: {
      [key: string]: { width: string, height: string },
      portrait: { width: string, height: string },
      landscape: { width: string, height: string },
    },
  } = {
    'a5': {
      'portrait': { width: '148mm', height: '210mm' },
      'landscape': { width: '210mm', height: '148mm' },
    },
    'a4': {
      'portrait': { width: '210mm', height: '297mm' },
      'landscape': { width: '297mm', height: '210mm' },
    },
    'a3': {
      'portrait': { width: '297mm', height: '420mm' },
      'landscape': { width: '420mm', height: '297mm' },
    },
    'b5': {
      'portrait': { width: '176mm', height: '250mm' },
      'landscape': { width: '250mm', height: '176mm' },
    },
    'b4': {
      'portrait': { width: '250mm', height: '353mm' },
      'landscape': { width: '353mm', height: '250mm' },
    },
    'jis-b5': {
      'portrait': { width: '182mm', height: '257mm' },
      'landscape': { width: '257mm', height: '182mm' },
    },
    'jis-b4': {
      'portrait': { width: '257mm', height: '364mm' },
      'landscape': { width: '364mm', height: '257mm' },
    },
    'letter': {
      'portrait': { width: '216mm', height: '279mm' },
      'landscape': { width: '280mm', height: '215mm' },
    },
    'legal': {
      'portrait': { width: '216mm', height: '355mm' },
      'landscape': { width: '356mm', height: '215mm' },
    },
    'ledger': {
      'portrait': { width: '279mm', height: '431mm' },
      'landscape': { width: '432mm', height: '280mm' },
    },
  };
  /**
   * string of "A4 portrait" --> { width: xx, height: xx }
   *
   * @export
   * @param {string} pagesize_opt
   * @returns
   * @throws {MandocCommandOptionError}
   */
  export function fromPagesizeOpt(pagesize_opt: string): PrintContext {
    const parsed_option = pagesize_opt.split(' ')
      .filter(value => value.length > 0);
    if (parsed_option.length < 1) {
      return {
        pageSize: 'A4',
        paperOrientation: 'portrait',
        paperWidth: mathjs.number(mathjs.unit(PAPER_FORMATS.a4.portrait.width), 'mm'),
        paperHeight: mathjs.number(mathjs.unit(PAPER_FORMATS.a4.portrait.height), 'mm'),
      };
    }
    const page_ctx = {
      paperOrientation: 'portrait',
    };
    if (parsed_option[1] === 'landscape') {
      page_ctx.paperOrientation = 'landscape';
    }
    const seek_paper_format = PAPER_FORMATS[parsed_option[0].toLowerCase()];
    if (seek_paper_format) {
      return {
        pageSize: parsed_option[0] as 'A4',
        paperWidth: mathjs.number(
          mathjs.unit(seek_paper_format[page_ctx.paperOrientation].width), 'mm'),
        paperHeight: mathjs.number(
          mathjs.unit(seek_paper_format[page_ctx.paperOrientation].height), 'mm'),
        paperOrientation: page_ctx.paperOrientation as 'portrait',
      };
    }
    /** `123mm 456mm` like pattern */
    if (parsed_option.length < 2) {
      // TODO Edge testing case
      throw new MandocCommandOptionError(
        `Unable to recognize height info: ${pagesize_opt}`);
    }

    return {
      // TODO catch exception from mathjs parsing string
      paperWidth: mathjs.number(
        mathjs.unit(parsed_option[0]), 'mm'),
      paperHeight: mathjs.number(
        mathjs.unit(parsed_option[1]), 'mm'),
    };
  }
}

export const generatePrintContext = PrintContextGenerator.fromPagesizeOpt;
