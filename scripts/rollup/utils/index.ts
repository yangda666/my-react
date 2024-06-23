import replacePlugin from '@rollup/plugin-replace';
import { readFileSync } from 'fs';
import path from 'path';

const pkgPath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

import comm from '@rollup/plugin-commonjs';
import ts from 'rollup-plugin-typescript2';
export function getPackagesJson(pkgName) {
  const path = getPkgPath(pkgName) + '/package.json';
  const str = readFileSync(path, { encoding: 'utf-8' });
  console.log('path', path);
  return JSON.parse(str);
}

export function getPkgPath(pkgName, isDist = false) {
  if (isDist) {
    return `${distPath}/${pkgName}`;
  }
  return `${pkgPath}/${pkgName}`;
}

export function getBaseRollupPlugin({
  alias = {
    __DEV__: true
  },
  typescript = {}
} = {}) {
  return [replacePlugin(alias), comm(), ts(typescript)];
}
