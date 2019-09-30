import { SchematicContext, Tree } from '@angular-devkit/schematics';

export enum PackageJsonDependencyTypes {
  DEFAULT = 'dependencies',
  DEV = 'devDependencies'
}
export interface PackageJsonDependency {
  type: PackageJsonDependencyTypes;
  version: string;
  name: string;
}

/**
 * Sorts the keys of the given object.
 * @returns A new object instance with sorted keys
 */
function sortObjectByKeys(obj: any) {
  return Object.keys(obj).sort().reduce((result: any, key: any) => (result[key] = obj[key]) && result, {});
}

export const addPackageJsonDependency = (_host: Tree, _context: SchematicContext, _dependency: PackageJsonDependency): Tree => {
  const packageJsonName = 'package.json';
  if (_host.exists(packageJsonName)) {
    const packageJsonContent = _host.read(packageJsonName)!.toString('utf-8');
    const packageJsonObj = JSON.parse(packageJsonContent);
    if (!packageJsonObj[_dependency.type]) {
      packageJsonObj[_dependency.type] = {};
    }
    if (!packageJsonObj[_dependency.type][_dependency.name]) {
      packageJsonObj[_dependency.type][_dependency.name] = _dependency.version;
      packageJsonObj[_dependency.type] = sortObjectByKeys(packageJsonObj[_dependency.type]);
    }
    _host.overwrite(packageJsonName, JSON.stringify(packageJsonObj, null, 2));
  }
  _context.logger.log('info', `Added "${_dependency.name} into ${_dependency.type}"`);
  return _host;
};
