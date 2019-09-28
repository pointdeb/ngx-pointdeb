import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  mergeWith,
  apply,
  url,
  template,
  forEach,
  FileEntry,
  SchematicsException
} from '@angular-devkit/schematics';
import {
  findModuleFromOptions,
  addModuleImportToModule,
  getProjectFromWorkspace,
  getProjectStyleFile
} from '@angular/cdk/schematics';
import { PackageJsonDependencyTypes, PackageJsonDependency, addPackageJsonDependency } from '../../utils';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { getWorkspace } from '@schematics/angular/utility/config';
import { InsertChange } from '@schematics/angular/utility/change';
import { createStylesContent } from './theming/theming';
import { Schema } from './schema';

const addPackageJsonDendencies = (): Rule => {
  return (_host: Tree, _context: SchematicContext) => {
    const dependencies: PackageJsonDependency[] = [
      { type: PackageJsonDependencyTypes.DEFAULT, version: '~8.2.0', name: '@angular/material' },
      { type: PackageJsonDependencyTypes.DEFAULT, version: '~8.2.0', name: '@angular/cdk' },
      { type: PackageJsonDependencyTypes.DEFAULT, version: '~2.0.8', name: 'hammerjs' },
      { type: PackageJsonDependencyTypes.DEFAULT, version: '~3.0.1', name: 'material-design-icons' }
    ];

    dependencies.forEach(dependency => addPackageJsonDependency(_host, _context, dependency));
    return _host;
  };
};

const installPackageJsonDependencies = (): Rule => {
  return (_host: Tree, _context: SchematicContext) => {
    _context.addTask(new NodePackageInstallTask());
    _context.logger.log('info', 'Installing packages');
  };
};

const applyTemplateFiles = (options: Schema): Rule => {
  return (_host: Tree, _context: SchematicContext) => {
    const rule = mergeWith(
      apply(url('./files'), [
        template({ ...options }),
        forEach((fileEntry: FileEntry) => {
          if (_host.exists(fileEntry.path)) {
            return null;
          }
          return fileEntry;
        })
      ])
    );
    return rule(_host, _context);
  };
};

const addSharedModulesToModule = (_options: Schema): Rule => {
  return (_host: Tree, _context: SchematicContext) => {
    const modulePath = findModuleFromOptions(_host, { name: _options.project })!;
    addModuleImportToModule(_host, modulePath, 'SharedModule', './shared/shared.module');
    return _host;
  };
};

const insertStyles = (_options: Schema): Rule => {
  return (_host: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(_host);
    const project = getProjectFromWorkspace(workspace, _options.project);
    const stylesPath = getProjectStyleFile(project, 'scss')!;
    if (!stylesPath) {
      throw new SchematicsException(`Could not find the style file!`);
    }
    const stylesContent = createStylesContent(_options.project);
    if (_host.read(stylesPath)!.toString().includes(stylesContent)) {
      _context.logger.info('Styles already made, so skipping...');
      return _host;
    }

    const insertion = new InsertChange(stylesPath, 0, stylesContent);
    const recorder = _host.beginUpdate(stylesPath);
    recorder.insertLeft(insertion.pos, insertion.toAdd);
    _host.commitUpdate(recorder);
    return _host;
  };
};

export function material(_options: Schema): Rule {
  return chain([
    addPackageJsonDendencies(),
    installPackageJsonDependencies(),
    applyTemplateFiles(_options),
    addSharedModulesToModule(_options),
    insertStyles(_options)
  ]);
}
