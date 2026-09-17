import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { RuleTester } from 'oxlint/plugins-dev';

RuleTester.describe = describe;

RuleTester.it = it;

const root = join(import.meta.dirname, '../src/anti-slop');

const upstreamTests = readdirSync(root, { recursive: true, encoding: 'utf8' })
  .filter((path) => path.endsWith('.test.ts'))
  .sort();

for (const path of upstreamTests) await import(join(root, path));
