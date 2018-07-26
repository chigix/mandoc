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

export const ConvertCommandOptions = typeof DEFAULT_CONVERTER_OPTS;
