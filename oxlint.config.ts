import { defineConfig } from 'oxlint';
import { base } from './src/oxlint/index.ts';

export default defineConfig({
  ...base,
  jsPlugins: ['./src/padding-lines.ts'],
  ignorePatterns: ['dist/**']
});
