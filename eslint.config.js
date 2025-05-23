import pluginReact from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['./apps/**/*.{js,jsx,ts,tsx}', './packages/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'simple-import-sort': simpleImportSort
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        project: './tsconfig.base.json'
      },
      globals: globals.browser
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Built-in imports (e.g. from Node.js)
            ['^\\w'],

            // External imports (e.g. from node_modules)
            ['^react', '^@?\\w'],

            // Internal imports (e.g. your own project imports)
            ['^src/', '^@/'], // Adjust based on your project structure

            // Style imports
            ['^\\./styles', '^\\.css', '^\\.scss']
          ]
        }
      ],
      'simple-import-sort/exports': 'error',
      'react/react-in-jsx-scope': 'off'
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    ignores: ['**/node_modules/', '**/dist/', '**/env.d.ts', '**/.history/', '**/eslint.config.js']
  }
];
