import assert from 'node:assert/strict';
import { it } from 'node:test';
import type { DummyRuleMap } from 'oxlint';
import antiSlopEffect from '../src/anti-slop/effect/index.ts';
import antiSlop from '../src/anti-slop/index.ts';
import { base, effect } from '../src/oxlint/index.ts';

const listConfiguredRules = (rules: DummyRuleMap, prefix: string) =>
  Object.keys(rules)
    .filter((name) => name.startsWith(prefix))
    .map((name) => name.slice(prefix.length))
    .sort();

it('base turns on every generic rule except the spacing one, which r1/padding-lines replaces', () => {
  const shipped = Object.keys(antiSlop.rules)
    .filter((name) => name !== 'require-readable-spacing')
    .sort();

  assert.deepEqual(listConfiguredRules(base.rules!, 'anti-slop/'), shipped);
});

it('effect turns on every Effect rule', () => {
  assert.deepEqual(
    listConfiguredRules(effect.rules!, 'anti-slop-effect/'),
    Object.keys(antiSlopEffect.rules).sort()
  );
});
