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
          '/package.json',
          '/src/app/app.module.ts',
          '/src/app/material/material.module.ts',
          '/src/app/shared/models/base-model.ts',
          '/src/app/shared/shared.module.ts',
          '/src/style.scss'
        ];
        expectedFiles = expectedFiles.sort().map(item => {
          expect(resultTree.files.includes(appOptions.name + item));
          return item;
        });
        expect(resultTree.readContent('/package.json')).toContain(`"@angular/material"`);
        expect(resultTree.readContent(appOptions.name + '/src/app/app.module.ts')).toContain(
          `import { SharedModule } from './shared/shared.module';`
        );
        expect(resultTree.readContent(appOptions.name + '/src/app/app.module.ts')).toContain(`SharedModule`);
        expect(resultTree.readContent(appOptions.name + '/src/styles.scss')).toContain(`@import '~@angular/material/theming'`);
      });
  });
});
