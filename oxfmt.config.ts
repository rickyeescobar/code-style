import { defineConfig } from 'oxfmt';
import { format } from './src/oxfmt.ts';

export default defineConfig({
  ...format,
  ignorePatterns: ['dist/', 'src/anti-slop/', 'pnpm-lock.yaml', '*.md']
});
