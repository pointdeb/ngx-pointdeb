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
  FileEntry
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {PackageJsonDependencyTypes, PackageJsonDependency, addPackageJsonDependency } from '../../utils';

const addPackageJsonDendencies =  (): Rule => {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: PackageJsonDependency[] = [
      { type: PackageJsonDependencyTypes.DEFAULT, version: '~8.2.0', name: '@angular/material' },
      { type: PackageJsonDependencyTypes.DEFAULT, version: '~8.2.0', name: '@angular/cdk' },
      { type: PackageJsonDependencyTypes.DEFAULT, version: '~2.0.8', name: 'hammerjs' },
      { type: PackageJsonDependencyTypes.DEFAULT, version: '~3.0.1', name: 'material-design-icons' },
    ];

    dependencies.forEach(dependency => addPackageJsonDependency(host, context, dependency));
    return host;
  };
};

const installPackageJsonDependencies = (): Rule => {
  return (_host: Tree, _context: SchematicContext) => {
    _context.addTask(new NodePackageInstallTask());
    _context.logger.log('info', 'Installing packages');
  };
};

const applyTemplateFiles = (options: any): Rule => {
  return (_host: Tree, _context: SchematicContext) => {
    const rule = mergeWith(
      apply(url('./files'), [
        template({...options}),
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

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function material(_options: any): Rule {
  return chain([
    addPackageJsonDendencies(),
    installPackageJsonDependencies(),
    applyTemplateFiles(_options)
  ]);
}
