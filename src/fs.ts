import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import {
  ProjectProperties,
} from './types';

export interface StructureItem {
  type: 'directory' | 'file';
  templatePath: string;
  relativePath: string;
}

export function isFreePath(fullProjectPath: string): boolean {
  try {
    fs.statSync(fullProjectPath);

    return false;
  } catch {
    return true;
  }
}

export function readTemplateStructure(absoluteTemplatePath: string): StructureItem[] {
  if (isFreePath(absoluteTemplatePath)) {
    throw Error(`${absoluteTemplatePath} is no directory`);
  }

  const items: StructureItem[] = [];
  const readPath = (relativePath = '') => {
    const absolutePath = path.resolve(absoluteTemplatePath, relativePath);

    fs.readdirSync(absolutePath).forEach((dirItem) => {
      const relativePathToDirItem = path.join(relativePath, dirItem);
      const absolutePathToDirItem = path.resolve(absolutePath, dirItem);
      const stat = fs.statSync(absolutePathToDirItem);

      if (stat.isDirectory()) {
        items.push({
          type: 'directory',
          templatePath: absolutePathToDirItem,
          relativePath: relativePathToDirItem,
        });

        readPath(relativePathToDirItem);

        return;
      }

      if (stat.isFile()) {
        items.push({
          type: 'file',
          templatePath: absolutePathToDirItem,
          relativePath: relativePathToDirItem,
        });

        return;
      }

      throw new Error('Unknown dir item into template folder');
    });
  };

  readPath();

  return items;
}

function processFile(opts: ProjectProperties, absoluteFilePath: string): string {
  const template = fs.readFileSync(absoluteFilePath, 'utf-8');

  return handlebars.compile(template)({
    project: opts,
  });
}

export function createProjectStructure(
  opts: ProjectProperties,
  structureItems: StructureItem[],
): void {
  structureItems.forEach((structureItem) => {
    const projectAbsolutePath = path.resolve(opts.absoluteProjectPath, structureItem.relativePath);

    switch (structureItem.type) {
      case 'directory':
        fs.mkdirSync(projectAbsolutePath);
        return;
      case 'file': {
        const fileContent = processFile(opts, structureItem.templatePath);
        const pathWithoutTemplateExtension = projectAbsolutePath.slice(0, -4);

        fs.writeFileSync(pathWithoutTemplateExtension, fileContent);

        return;
      }
      default:
        throw new Error('Unknown structure item type');
    }
  });
}
