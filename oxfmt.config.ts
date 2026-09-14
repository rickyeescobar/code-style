import { defineConfig } from 'oxfmt';
import { format } from './src/oxfmt.ts';

export default defineConfig({ ...format, ignorePatterns: ['dist/', 'pnpm-lock.yaml', '*.md'] });
