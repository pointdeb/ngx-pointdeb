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
  SchematicsException,
  move
} from '@angular-devkit/schematics';
import {
  findModuleFromOptions,
  addModuleImportToModule,
  getProjectFromWorkspace,
  getProjectStyleFile,
  getProjectTargetOptions,
  getProjectMainFile
} from '@angular/cdk/schematics';
import {
  PackageJsonDependencyTypes,
  PackageJsonDependency,
  addPackageJsonDependency,
  PackageJsonScript,
  addPackageJsonScript
} from '../../utils';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { getWorkspace } from '@schematics/angular/utility/config';
import { InsertChange } from '@schematics/angular/utility/change';
import { createStylesContent, getLoaderComponent, getAppComponentContent } from './contents/theming';
import { Schema } from './schema';
import { getProxyConfig } from './contents/proxy-config';
import { getHtaccess } from './contents/htaccess';

const addPackageJsonDendencies = (): Rule => {
  return (_host: Tree, _context: SchematicContext) => {
    const dependencies: PackageJsonDependency[] = [
      { type: PackageJsonDependencyTypes.DEFAULT, version: '~8.2.0', name: '@angular/material' },
      { type: PackageJsonDependencyTypes.DEFAULT, version: '~8.2.0', name: '@angular/cdk' },
      { type: PackageJsonDependencyTypes.DEFAULT, version: '~2.0.8', name: 'hammerjs' },
      { type: PackageJsonDependencyTypes.DEFAULT, version: '~3.0.1', name: 'material-design-icons' }
    ];

    const scripts: PackageJsonScript[] = [
      { key: 'start', script: `ng serve --proxy-config=proxy-config.js` },
      { key: 'build', script: `ng build --aot --prod --output-hashing=none` },
    ];

    dependencies.forEach(dependency => addPackageJsonDependency(_host, _context, dependency));
    scripts.forEach(script => addPackageJsonScript(_host, _context, script));
    return _host;
  };
};

const installPackageJsonDependencies = (): Rule => {
  return (_host: Tree, _context: SchematicContext) => {
    _context.addTask(new NodePackageInstallTask());
    _context.logger.log('info', 'Installing packages');
  };
};

const applyTemplateFiles = (_options: Schema): Rule => {
  return (_host: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(_host);
    const project = getProjectFromWorkspace(workspace, _options.project);
    const rule = mergeWith(
      apply(url('./files'), [
        template({ ..._options, name: _options.project }),
        forEach((fileEntry: FileEntry) => {
          if (_host.exists(project.root + fileEntry.path)) {
            return null;
          }
          return fileEntry;
        }),
        move(project.root)
      ])
    );
    return rule(_host, _context);
  };
};

const addSharedModulesToModule = (_options: Schema): Rule => {
  return (_host: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(_host);
    const project = getProjectFromWorkspace(workspace, _options.project);
    const buildOptions = getProjectTargetOptions(project, 'build');
    const modulePath = findModuleFromOptions(_host, { name: _options.project })!;

    addModuleImportToModule(_host, modulePath, 'BrowserAnimationsModule', '@angular/platform-browser/animations');
    addModuleImportToModule(_host, modulePath, 'SharedModule', './shared/shared.module');
    addModuleImportToModule(_host, modulePath, 'AppRoutingModule', './app-routing.module');
    // add loading to index.html
    if (!buildOptions.index) {
      throw new SchematicsException('No project "index.html" file could be found.');
    }
    const mainAppTag = `${project.prefix}-root`;
    const indexHtmlContent = _host.read(buildOptions.index)!.toString()
      .replace(`<${mainAppTag}></${mainAppTag}>`, `<${mainAppTag}>${getLoaderComponent()}</${mainAppTag}>`);
    _host.overwrite(buildOptions.index, indexHtmlContent);

    // add hammerjs to main.ts
    const mainTsFile = getProjectMainFile(project);
    const mainTsContent = _host.read(mainTsFile)!.toString();
    if (!mainTsContent.match(`import 'hammerjs';`)) {
      _host.overwrite(mainTsFile, `import 'hammerjs';\n` + mainTsContent);
    }

    // add navigation template to app.component.html
    const appComponentHtmlFile = modulePath.replace('module.ts', 'component.html');
    const appComponentHtmlContent = _host.read(appComponentHtmlFile)!.toString();
    if (!appComponentHtmlContent.match(`router-outlet`)) {
      _host.overwrite(appComponentHtmlFile, getAppComponentContent(appComponentHtmlContent, _options.placeholder));
    }

    // add proxy-config file
    const proxyConfigFile = 'proxy-config.js';
    if (!_host.exists(proxyConfigFile)) {
      _host.create(proxyConfigFile, getProxyConfig());
    }

    // add .htaccess file
    const htaccessFile = '.htaccess';
    if (!_host.exists(htaccessFile)) {
      _host.create(htaccessFile, getHtaccess());
    }
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
  return (_host: Tree, _context: SchematicContext) => {
    if (!_options.project) {
      const workspace = getWorkspace(_host);
      _options.project = workspace.defaultProject!;
    }
    return chain([
      addPackageJsonDendencies(),
      installPackageJsonDependencies(),
      applyTemplateFiles(_options),
      addSharedModulesToModule(_options),
      insertStyles(_options)
    ]);
  };
}
