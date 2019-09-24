import { SchematicContext, Tree } from '@angular-devkit/schematics';

export enum PackageJsonDependencyTypes {
  DEFAULT = 'default',
  DEV = 'dev'
}
export interface PackageJsonDependency {
  type: PackageJsonDependencyTypes;
  version: string;
  name: string;
}

export const addPackageJsonDependency = (_host: Tree, _context: SchematicContext, _dependency: PackageJsonDependency): Tree => {
  _context.logger.log('info', `Added "${_dependency.name} into ${_dependency.type}"`);
  return _host;
};
