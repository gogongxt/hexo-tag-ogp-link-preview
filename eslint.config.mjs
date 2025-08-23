import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default defineConfig([
    {
        files: ['**/*.{js,mjs}'],
        plugins: {
            import: importPlugin,
        },
        extends: [
            js.configs.recommended,
            stylistic.configs.recommended,
        ],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
                hexo: 'readonly',
            },
        },
        rules: {
            'import/order': ['error', {
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            }],
            'import/newline-after-import': ['error'],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/quote-props': ['error', 'consistent-as-needed'],
            '@stylistic/indent': ['error', 4, {
                SwitchCase: 1,
            }],
            '@stylistic/comma-dangle': ['error', {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'never',
            }],
            '@stylistic/object-curly-spacing': ['error', 'always', {
                objectsInObjects: true,
            }],
            'complexity': ['error', {
                max: 5,
                variant: 'modified',
            }],
        },
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'commonjs',
        },
    },
]);
