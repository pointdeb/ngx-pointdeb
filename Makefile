.DEFAULT_GOAL := build
dist_path := ./dist

build:
	rm -rfv $(dist_path)
	npm run build
	tsc -p projects/common/tsconfig.schematics.json
	cp -rfv projects/common/collection.json $(dist_path)/common
	cp -rfv projects/common/schematics/material/files $(dist_path)/common/schematics/material
	cp -rfv projects/common/schematics/material/schema.json $(dist_path)/common/schematics/material
	cd $(dist_path)/common && npm link

test:
	rm -rfv $(dist_path)
	npm run build
	tsc -p projects/common/tsconfig.schematics.json
	cp -rfv projects/common/collection.json $(dist_path)/common
	cp -rfv projects/common/schematics/material/files $(dist_path)/common/schematics/material
	cp -rfv projects/common/schematics/material/schema.json $(dist_path)/common/schematics/material
	./node_modules/.bin/jasmine dist/**/schematics/**/*_spec.js
