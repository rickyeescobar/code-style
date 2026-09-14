import { defineConfig } from 'oxlint';

export const base = defineConfig({
  plugins: ['typescript', 'import', 'oxc', 'eslint', 'unicorn'],
  jsPlugins: ['@r1/code-style/padding-lines'],
  categories: {
    correctness: 'error',
    suspicious: 'error',
    perf: 'error'
  },
  rules: {
    'r1/padding-lines': 'error',
    complexity: ['error', 10],
    'typescript/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
    'typescript/no-import-type-side-effects': 'error',
    'typescript/no-unnecessary-type-assertion': 'error',
    'typescript/no-useless-empty-export': 'error',
    'typescript/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'typescript/array-type': ['error', { default: 'generic', readonly: 'generic' }],
    'import/no-duplicates': 'error',
    'import/no-self-import': 'error',
    'import/no-empty-named-blocks': 'error',
    'eslint/no-console': 'error',
    'eslint/no-var': 'error',
    'eslint/no-useless-constructor': 'error',
    'eslint/no-unneeded-ternary': 'error',
    'eslint/no-useless-concat': 'error',
    'unicorn/no-abusive-eslint-disable': 'error',
    'unicorn/no-accessor-recursion': 'error',
    'unicorn/prefer-array-flat-map': 'error',
    'oxc/misrefactored-assign-op': 'error',
    'eslint/no-await-in-loop': 'off',
    'eslint/no-control-regex': 'off',
    'eslint/no-fallthrough': 'off',
    'eslint/no-shadow': 'off',
    'eslint/no-underscore-dangle': 'off',
    'eslint/no-unused-vars': 'off',
    'eslint/object-shorthand': 'off',
    'eslint/require-yield': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-unassigned-import': 'off',
    'oxc/no-map-spread': 'off',
    'typescript/ban-ts-comment': 'off',
    'typescript/no-confusing-non-null-assertion': 'off',
    'typescript/no-dynamic-delete': 'off',
    'typescript/no-empty-interface': 'off',
    'typescript/no-empty-object-type': 'off',
    'typescript/no-explicit-any': 'off',
    'typescript/no-invalid-void-type': 'off',
    'typescript/no-namespace': 'off',
    'typescript/no-non-null-assertion': 'off',
    'typescript/no-unsafe-function-type': 'off',
    'typescript/unified-signatures': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/no-array-reverse': 'off',
    'unicorn/no-array-sort': 'off',
    'unicorn/no-new-array': 'off',
    'unicorn/no-useless-spread': 'off',
    'unicorn/prefer-add-event-listener': 'off',
    'unicorn/prefer-set-has': 'off',
    'unicorn/require-post-message-target-origin': 'off'
  },
  overrides: [
    {
      files: ['**/test/**', '**/seed/**', '**/scripts/**', '**/*.config.ts'],
      rules: { 'eslint/no-console': 'off' }
    }
  ]
});

// `plugins` replaces the base list instead of adding to it, so the React config restates it.
export const react = defineConfig({
  plugins: [...base.plugins!, 'react'],
  rules: {
    'react/rules-of-hooks': 'error',
    'react/exhaustive-deps': 'error',
    'react/react-in-jsx-scope': 'off'
  }
});
