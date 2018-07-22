import * as Commander from 'commander';
import * as Cmds from './commanders';

Commander.version(require('../package.json').version, '-v, --version')
  .description('Markdown Document Management Tool');

Cmds.DocConverter.configureOptions(
  Commander.command('convert')
    .description(Cmds.DocConverter.description)
    .arguments(Cmds.DocConverter.arguments) as typeof Commander,
).action(Cmds.DocConverter.receiver);

Cmds.HtmlTemplateGenerator.configureOptions(
  Commander.command('tpl')
    .description(Cmds.HtmlTemplateGenerator.description)
    .arguments(Cmds.HtmlTemplateGenerator.arguments) as typeof Commander,
).action(Cmds.HtmlTemplateGenerator.receiver);

if (!process.argv.slice(2).length) {
  Commander.outputHelp();
  process.exit();
}

Commander.parse(process.argv);
