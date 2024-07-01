import {
  getBaseRollupPlugin,
  getPackagesJson,
  getPkgPath
} from './utils/index.ts';

import alias from '@rollup/plugin-alias';
import generatePackageJson from 'rollup-plugin-generate-package-json';
const { name, module, peerDependencies } = getPackagesJson('react-dom');
const pkgPath = getPkgPath(name);
const distPath = getPkgPath(name, true);
export default [
  {
    input: `${pkgPath}/${module}`,
    output: [
      {
        file: `${distPath}/index.js`,
        name: 'ReactDOM',
        format: 'umd'
      },
      {
        file: `${distPath}/client.js`,
        name: 'client',
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
    ],
    external: [...Object.keys(peerDependencies)]
  },
  // react-test-utils
  {
    input: `${pkgPath}/test-utils.ts`,
    external: ['react-dom', 'react'],
    output: [
      {
        file: `${distPath}/jsx-runtime.js`,
        name: 'jsx-runtime',
        format: 'umd'
      },
      {
        file: `${distPath}/jsx-dev-runtime.js`,
        name: 'jsx-dev-runtime',
        format: 'umd'
      }
    ],
    plugins: getBaseRollupPlugin()
  }
];
