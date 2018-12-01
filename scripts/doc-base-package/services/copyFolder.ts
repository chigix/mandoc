import * as shelljs from 'shelljs';

export function copyFolder() {
  return (from, to) => {
    shelljs.mkdir(to);
    shelljs.cp(from + '/*', to);
  };
}
