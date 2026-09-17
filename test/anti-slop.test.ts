import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { DummyRuleMap } from 'oxlint';
import { RuleTester } from 'oxlint/plugins-dev';
import antiSlopEffect from '../src/anti-slop/effect/index.ts';
import antiSlop from '../src/anti-slop/index.ts';
import { base, effect } from '../src/oxlint/index.ts';

RuleTester.describe = describe;

RuleTester.it = it;

const tester = new RuleTester({ languageOptions: { parserOptions: { lang: 'ts' } } });

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

tester.run('no-array-filter-map', antiSlop.rules['no-array-filter-map']!, {
  valid: [
    {
      name: 'one flatMap',
      code: 'const xs = [1, 2];\nconst ys = xs.flatMap((x) => (x > 0 ? [x * 2] : []));'
    }
  ],
  invalid: [
    {
      name: 'filter then map',
      code: 'const xs = [1, 2];\nconst ys = xs.filter((x) => x > 0).map((x) => x * 2);',
      errors: 1
    }
  ]
});

tester.run('no-manual-tag-comparison', antiSlopEffect.rules['no-manual-tag-comparison']!, {
  valid: [{ name: 'a predicate', code: "Predicate.isTagged(value, 'Some');" }],
  invalid: [{ name: 'a hand comparison', code: "value._tag === 'Some';", errors: 1 }]
});
