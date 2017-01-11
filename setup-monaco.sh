#!/bin/sh

TYPESCRIPT_VERSION="2.1.4"

cd node_modules
rm -rf monaco-editor
git clone https://github.com/Microsoft/monaco-editor.git
cd monaco-editor
npm install
cd node_modules
rm -rf monaco-typescript
git clone https://github.com/Microsoft/monaco-typescript.git
cd monaco-typescript
npm install --save-dev gulp-requirejs@1.0.0-rc1
npm install --save-dev typescript@${TYPESCRIPT_VERSION}
npm install
gulp import-typescript
gulp release
rm -rf .git
cd ../..
gulp release
rm -rf .git
