import assert from 'node:assert/strict';
import { it } from 'node:test';
import type { DummyRuleMap } from 'oxlint';
import antiSlopEffect from '../src/anti-slop/effect/index.ts';
import { noManualTagComparisonRule } from '../src/anti-slop/effect/rules/no-manual-tag-comparison.ts';
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

const tagMessages = noManualTagComparisonRule.meta!.messages!;

it('the comparison message names the tag tests that the compiler checks before Predicate.isTagged', () => {
  const message = tagMessages.manualComparison!;
  const isTagged = message.indexOf('Predicate.isTagged');

  for (const form of ["$is('Tag')", 'guards.Tag', 'Match.tag', 'Match.valueTags']) {
    assert.ok(message.includes(form) && message.indexOf(form) < isTagged, form);
  }

  assert.match(message, /any string/);
});

it('the switch message names $match and Match.valueTags, which also rejects an unknown tag', () => {
  const message = tagMessages.manualSwitch!;

  assert.match(message, /\$match/);
  assert.match(message, /Match\.valueTags/);
  assert.match(message, /unknown tag/);
});

it('no Effect message names isAnyOf, which does not check its tags', () => {
  const messages = Object.values(antiSlopEffect.rules).flatMap((rule) =>
    Object.values(rule.meta?.messages ?? {})
  );

  assert.ok(messages.length > 0);
  assert.ok(messages.every((message) => !message.includes('isAnyOf')));
});
