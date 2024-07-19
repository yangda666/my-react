import comm from '@rollup/plugin-commonjs';
import replacePlugin from '@rollup/plugin-replace';
import { readFileSync } from 'fs';

// const pkgPath = path.resolve(__dirname, '../../../packages');
// const distPath = path.resolve(__dirname, '../../../dist/node_modules');

const pkgPath = '/Users/junyang/workSpace/my-react/packages';
const distPath = '/Users/junyang/workSpace/my-react/dist/node_modules';

console.log('pkgPath', pkgPath);

import ts from 'rollup-plugin-typescript2';
export function getPackagesJson(pkgName) {
  const path = getPkgPath(pkgName) + '/package.json';
  const str = readFileSync(path, { encoding: 'utf-8' });
  console.log('path', path);
  return JSON.parse(str);
}

export function getPkgPath(pkgName, isDist = false) {
  console.log(pkgName, pkgPath);
  if (isDist) {
    return `${distPath}/${pkgName}`;
  }
  return `${pkgPath}/${pkgName}`;
}

export function getBaseRollupPlugin({
  alias = {
    __DEV__: true,
    preventAssignment: false
  },
  typescript = {}
} = {}) {
  return [replacePlugin(alias), comm(), ts(typescript)];
}
