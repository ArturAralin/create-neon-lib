import * as fs from 'fs';
import * as path from 'path';
import * as commander from 'commander';
import {
  stdAsk,
  stdWrite,
  stdErrWrite,
} from './std-io';
import {
  isFreePath,
  readTemplateStructure,
  createProjectStructure,
} from './fs';
import {
  ProjectProperties,
} from './types';

const CWD = process.cwd();
const TEMPLATE_DIR = path.resolve(__dirname, '../template');
const program = new commander.Command();

program.version('0.1.0');

function createProject(opts: ProjectProperties) {
  if (!isFreePath(opts.absoluteProjectPath)) {
    stdWrite(`${opts.absoluteProjectPath} is non empty`);

    return;
  }

  fs.mkdirSync(opts.absoluteProjectPath);

  const templateStructure = readTemplateStructure(TEMPLATE_DIR);

  createProjectStructure(opts, templateStructure);
}

async function createNewNeonApp(projectName: string) {
  try {
    const absoluteProjectPath = path.resolve(CWD, `./${projectName}`);
    const projectVersion = await stdAsk('Version', '1.0.0');
    const projectDescription = await stdAsk('Description', '');
    const authorName = await stdAsk('Author', '');
    const authorEmail = await stdAsk('Email', '');
    const license = await stdAsk('License', 'MIT');

    const opts: ProjectProperties = {
      absoluteProjectPath,
      name: projectName,
      version: projectVersion,
      description: projectDescription,
      author: `${authorName} <${authorEmail}>`,
      license,
    };

    createProject(opts);

    stdWrite('Successfully created!');

    process.exit(0);
  } catch (e) {
    stdErrWrite(e.toString());

    process.exit(1);
  }
}

program
  .command('new <name>', {
    isDefault: true,
  })
  .description('creates new neon lib')
  .action(createNewNeonApp);

program.parse(process.argv);
