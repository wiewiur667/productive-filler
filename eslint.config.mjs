import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [{
  ignores: ['dist', 'node_modules']
}, ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'), {
  plugins: {
    '@typescript-eslint': typescriptEslint
  },

  languageOptions: {
    globals: {
      ...globals.node
    },

    parser: tsParser,
    ecmaVersion: 'latest',
    sourceType: 'module'
  },

  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    indent: ['error', 2],
    'comma-dangle': ['error', 'never']
  }
}, {
  files: ['**/*.ts'],

  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  }
}];