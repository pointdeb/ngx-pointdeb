export declare enum PackageJsonDependencyTypes {
    DEFAULT = "dependencies",
    DEV = "devDependencies"
}
export interface PackageJsonDependency {
    type: PackageJsonDependencyTypes;
    version: string;
    name: string;
}
export declare const addPackageJsonDependency: (_host: import("@angular-devkit/schematics/src/tree/interface").Tree, _context: import("@angular-devkit/schematics").TypedSchematicContext<{}, {}>, _dependency: PackageJsonDependency) => import("@angular-devkit/schematics/src/tree/interface").Tree;
