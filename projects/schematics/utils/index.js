"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PackageJsonDependencyTypes;
(function (PackageJsonDependencyTypes) {
    PackageJsonDependencyTypes["DEFAULT"] = "default";
    PackageJsonDependencyTypes["DEV"] = "dev";
})(PackageJsonDependencyTypes = exports.PackageJsonDependencyTypes || (exports.PackageJsonDependencyTypes = {}));
exports.addPackageJsonDependency = (host, context, dependency) => {
    context.logger.log('info', `Added "${dependency.name} into ${dependency.type}"`);
    return host;
};
//# sourceMappingURL=index.js.map