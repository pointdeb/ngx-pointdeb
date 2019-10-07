import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');
const runner = new SchematicTestRunner('schematics', collectionPath);
let appTree: UnitTestTree;
const appOptions = { name: 'application', style: 'scss' };
const workspaceOptions = { name: 'workspace', version: 'latest' };

describe('material', () => {
  beforeEach(async () => {
    appTree = await runner.runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions).toPromise();
    appTree = await runner.runExternalSchematicAsync('@schematics/angular', 'application', appOptions, appTree).toPromise();
  });
  it('init material', () => {
    runner
      .runSchematicAsync('material', {}, appTree)
      .toPromise()
      .then(resultTree => {
        let expectedFiles = [
          `/package.json`,
          `/proxy-config.js`,
          `/${appOptions.name}/src/app/app.module.ts`,
          `/${appOptions.name}/src/app/material/material.module.ts`,
          `/${appOptions.name}/src/app/shared/models/base-model.ts`,
          `/${appOptions.name}/src/app/shared/shared.module.ts`,
          `/${appOptions.name}/src/app/shared/pages/not-found/not-found.component.ts`,
          `/${appOptions.name}/src/styles.scss`,
          `/${appOptions.name}/src/app/app-routing.module.ts`,
        ];
        expectedFiles = expectedFiles.sort().map(item => {
          expect(resultTree.files.includes(item)).toBeTruthy(item);
          return item;
        });
        expect(resultTree.readContent('/package.json')).toContain(`"@angular/material"`);
        expect(resultTree.readContent(appOptions.name + '/src/app/app.module.ts')).toContain(
          `import { SharedModule } from './shared/shared.module';`
        );
        expect(resultTree.readContent(appOptions.name + '/src/app/app.module.ts')).toContain(`SharedModule`);
        expect(resultTree.readContent(appOptions.name + '/src/app/app.module.ts')).toContain(`AppRoutingModule`);
        expect(resultTree.readContent(appOptions.name + '/src/app/app.component.html')).toContain(`router-outlet`);
        expect(resultTree.readContent(appOptions.name + '/src/styles.scss')).toContain(`@import '~@angular/material/theming'`);
        expect(resultTree.readContent(appOptions.name + '/src/index.html')).toContain(`Loading...`);
        expect(resultTree.readContent(appOptions.name + '/src/main.ts')).toContain(`import 'hammerjs';`);
      });
  });
});
