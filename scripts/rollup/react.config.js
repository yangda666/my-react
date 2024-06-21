import {
  getBaseRollupPlugin,
  getPackagesJson,
  getPkgPath
} from './utils/index.ts';

import generatePackageJson from 'rollup-plugin-generate-package-json';

const { name, module } = getPackagesJson('react');
const pkgPath = getPkgPath(name);
const distPath = getPkgPath(name, true);
export default [
  {
    input: `${pkgPath}/${module}`,
    output: {
      file: `${distPath}/index.js`,
      name: 'index.js',
      format: 'umd'
      // globals: {
      //   'shared/ReactSymbol': 'ReactSymbol', // 指定外部依赖模块的全局变量名称
      //   'shared/hasOwnProperty': 'hasOwnProperty'
      // }
    },
    plugins: [
      ...getBaseRollupPlugin(),
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: distPath,
        baseContents: ({ name, version, description }) => ({
          name,
          description,
          version,
          main: 'index.js'
        })
      })
    ]
  },
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: [
      {
        file: `${distPath}/jsx-runtime.js`,
        name: 'jsx-runtime.js',
        format: 'umd'
      },
      {
        file: `${distPath}/jsx-dev-runtime.js`,
        name: 'jsx-dev-runtime.js',
        format: 'umd'
      }
    ]
  }
];
