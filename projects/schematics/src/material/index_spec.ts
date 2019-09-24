import { HostTree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
// import * as fs from 'fs';

// const expectedPackageJson = fs.readFileSync(path.resolve(__dirname, './../../tests/material/expected-json.json'), {encoding: 'utf-8'});


const collectionPath = path.join(__dirname, '../collection.json');


describe('material', () => {
  it('init material', () => {

    const tree = new UnitTestTree(new HostTree());
    tree.create('package.json', JSON.stringify({}));
    const runner = new SchematicTestRunner('schematics', collectionPath);
    runner.runSchematicAsync('material', {}, tree).toPromise().then((resultTree) => {
      const expectedFiles = [
        '/package.json',
        '/src/app/app.module.ts',
        '/src/app/material/material.module.ts',
        '/src/app/shared/models/base-model.ts',
        '/src/app/shared/shared.module.ts'
      ];

      expect(resultTree.files.sort()).toEqual(expectedFiles.sort());
      expect(resultTree.readContent('/package.json')).toContain(`"@angular/material"`);
    });
  });
});
