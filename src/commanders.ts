import * as Commander from 'commander';

export const DocConverter = {
  description: 'Markdown Document Converting Tool',
  arguments: '[file]',
  configureOptions: (command: typeof Commander) => {
    command.option('-o, --output [FILE]', 'Write output to FILE instead of stdout.');
    command.option('-f, --from [FORMAT]', 'Specify input format.');
    command.option('--verbose', 'Give verbose debugging output.');

    return command;
  },
  receiver: (file: string) => {
    console.log(file);
  },
};

export const HtmlTemplateGenerator = {
  description: 'Generate Html Template for Converting',
  arguments: '',
  configureOptions: (command: typeof Commander) => {
    return command;
  },
  receiver: (file: string) => {
    console.log(file);
  },
};
