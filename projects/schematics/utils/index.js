"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PackageJsonDependencyTypes;
(function (PackageJsonDependencyTypes) {
    PackageJsonDependencyTypes["DEFAULT"] = "dependencies";
    PackageJsonDependencyTypes["DEV"] = "devDependencies";
})(PackageJsonDependencyTypes = exports.PackageJsonDependencyTypes || (exports.PackageJsonDependencyTypes = {}));
/**
 * Sorts the keys of the given object.
 * @returns A new object instance with sorted keys
 */
function sortObjectByKeys(obj) {
    return Object.keys(obj).sort().reduce((result, key) => (result[key] = obj[key]) && result, {});
}
exports.addPackageJsonDependency = (_host, _context, _dependency) => {
    const packageJsonName = 'package.json';
    if (_host.exists(packageJsonName)) {
        const packageJsonContent = _host.read(packageJsonName).toString('utf-8');
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
//# sourceMappingURL=index.js.map