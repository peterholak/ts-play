#!/bin/sh

TYPESCRIPT_VERSION="3.6.2"
MONACO_COMMIT=master
MONACO_TS_COMMIT=master

cd node_modules
rm -rf monaco-editor
git clone https://github.com/Microsoft/monaco-editor.git
cd monaco-editor
git checkout $MONACO_COMMIT
npm install
cd node_modules
# Node types mess with function like `setTimeout`.
rm -rf @types/node @types/fs-extra @types/glob @types/shelljs
rm -rf monaco-typescript
git clone https://github.com/Microsoft/monaco-typescript.git
cd monaco-typescript
git checkout $MONACO_COMMIT
npm install --save-dev typescript@${TYPESCRIPT_VERSION}
npm install
npm run import-typescript
npm run prepublishOnly
rm -rf .git
cd ../..
gulp release
rm -rf .git
