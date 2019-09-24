import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {PackageJsonDependencyTypes, PackageJsonDependency, addPackageJsonDependency } from '../../utils';

const addPackageJsonDendencies =  (): Rule => {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: PackageJsonDependency[] = [
      { type: PackageJsonDependencyTypes.DEFAULT, version: 'latest', name: '@angular/material' },
      { type: PackageJsonDependencyTypes.DEFAULT, version: 'latest', name: '@angular/cdk' },
      { type: PackageJsonDependencyTypes.DEFAULT, version: 'latest', name: 'hammerjs' },
      { type: PackageJsonDependencyTypes.DEFAULT, version: 'latest', name: 'material-design-icons' },
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

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function material(_options: any): Rule {
  return chain([
    addPackageJsonDendencies(),
    installPackageJsonDependencies()
  ]);
}
