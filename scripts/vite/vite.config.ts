import replace from '@rollup/plugin-replace';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { getPkgPath } from '../rollup/utils';
// https://vitejs.dev/config/
const config = defineConfig({
  plugins: [
    react(),
    replace({
      __DEV__: true,
      preventAssignment: true
    })
  ],
  resolve: {
    alias: [
      {
        find: 'react',
        replacement: getPkgPath('react')
      },
      {
        find: 'react-dom',
        replacement: getPkgPath('react-dom')
      },
      {
        find: 'hostConfig',
        replacement: path.resolve(
          getPkgPath('react-dom'),
          './src/hostConfig.ts'
        )
      }
    ]
  }
});

console.log(config.resolve.alias);

export default config;
