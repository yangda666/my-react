import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { ignores: ['**/*.test.js', '**/*.config.mjs'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier
    },
    rules: {
      'prettier/prettier': ['error'],
      quotes: ['error', 'single', { allowTemplateLiterals: true }]
    }
  },
  // Path: typescript-eslint
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      "@typescript-eslint/consistent-type-imports": ["error", {
        "prefer": "type-imports"
      }]
    }
  }

];
