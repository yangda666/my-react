import {
  getBaseRollupPlugin,
  getPackagesJson,
  getPkgPath
} from './utils/index.ts';

import alias from '@rollup/plugin-alias';
import generatePackageJson from 'rollup-plugin-generate-package-json';
const { name, module } = getPackagesJson('react-dom');
const pkgPath = getPkgPath(name);
const distPath = getPkgPath(name, true);
export default [
  {
    input: `${pkgPath}/${module}`,
    output: [
      {
        file: `${distPath}/index.js`,
        name: 'index.js',
        format: 'umd'
      },
      {
        file: `${distPath}/client.js`,
        name: 'client.js',
        format: 'umd'
      }
    ],
    plugins: [
      ...getBaseRollupPlugin(),
      alias({
        entries: {
          hostConfig: `${pkgPath}/src/hostConfig.ts`
        }
      }),
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: distPath,
        baseContents: ({ name, version, description }) => ({
          name,
          description,
          version,
          peerDependencies: {
            react: version
          },
          main: 'index.js'
        })
      })
    ]
  }
];
