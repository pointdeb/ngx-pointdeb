export declare enum PackageJsonDependencyTypes {
    DEFAULT = "default",
    DEV = "dev"
}
export interface PackageJsonDependency {
    type: PackageJsonDependencyTypes;
    version: string;
    name: string;
}
export declare const addPackageJsonDependency: (host: import("@angular-devkit/schematics/src/tree/interface").Tree, context: import("@angular-devkit/schematics").TypedSchematicContext<{}, {}>, dependency: PackageJsonDependency) => import("@angular-devkit/schematics/src/tree/interface").Tree;
