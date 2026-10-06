#!/usr/bin/env node
// Usage: npm run new -- MyVideo
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2];
if (!name || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
  console.error('Usage: npm run new -- PascalCaseName');
  process.exit(1);
}
const dir = path.join(root, 'src/compositions', name);
if (fs.existsSync(dir)) {
  console.error(`${dir} already exists`);
  process.exit(1);
}
fs.mkdirSync(dir, {recursive: true});
fs.writeFileSync(
  path.join(dir, `${name}.tsx`),
  `import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AnimatedBackground} from '../../components/AnimatedBackground';
import {AnimatedTitle} from '../../components/AnimatedTitle';

export const ${name}: React.FC = () => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <AnimatedBackground />
    <AnimatedTitle text="${name}" />
  </AbsoluteFill>
);
`,
);
fs.writeFileSync(path.join(dir, 'index.ts'), `export {${name}} from './${name}';\n`);

const rootFile = path.join(root, 'src/Root.tsx');
let src = fs.readFileSync(rootFile, 'utf8');
src = src.replace(
  /(import \{Showcase\}[^\n]*\n)/,
  `$1import {${name}} from './compositions/${name}';\n`,
);
const block = [
  '      <Composition',
  `        id="${name}"`,
  `        component={${name}}`,
  '        width={VIDEO.width}',
  '        height={VIDEO.height}',
  '        fps={VIDEO.fps}',
  '        durationInFrames={durationInFrames(VIDEO.durationInSeconds)}',
  '      />',
].join('\n');
src = src.replace(/\n(\s*)<\/>/, `\n${block}\n$1</>`);
fs.writeFileSync(rootFile, src);
console.log(`Created src/compositions/${name} and registered it in src/Root.tsx`);
