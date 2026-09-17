import { defineConfig } from 'oxlint';
import { base } from './src/oxlint/index.ts';

export default defineConfig({
  ...base,
  jsPlugins: ['./src/padding-lines.ts', './src/anti-slop/index.ts'],
  ignorePatterns: ['dist/**', 'src/anti-slop/**']
});
