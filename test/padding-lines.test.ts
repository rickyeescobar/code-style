import { describe, it } from 'node:test';
import { RuleTester } from 'oxlint/plugins-dev';
import { paddingLines } from '../src/padding-lines.ts';

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({ languageOptions: { parserOptions: { lang: 'ts' } } });

const lines = (...parts: ReadonlyArray<string>) => parts.join('\n') + '\n';

tester.run('padding-lines', paddingLines, {
  valid: [
    { name: 'imports stay tight', code: lines("import a from 'a';", "import b from 'b';") },
    { name: 'declarations stay tight', code: lines('const a = 1;', 'const b = 2;') },
    {
      name: 'one-line guards stay tight',
      code: lines(
        'const f = (x: number) => {',
        '  if (x < 0) return 0;',
        '  if (x > 9) return 9;',
        '',
        '  return x;',
        '};'
      )
    },
    {
      name: 'one-line exports stay tight',
      code: lines('export const a = 1;', 'export const b = 2;')
    },
    { name: 'a blank line after a declaration', code: lines('const a = 1;', '', 'a();') },
    { name: 'a blank line after a block', code: lines('if (a) {', '  b();', '}', '', 'c();') },
    {
      name: 'a blank line before a return',
      code: lines('const f = () => {', '  a();', '', '  return 1;', '};')
    },
    {
      name: 'a blank line above a comment counts for the statement under it',
      code: lines('a();', '', '// why', 'return;')
    },
    { name: 'plain calls stay tight', code: lines('a();', 'b();') }
  ],
  invalid: [
    {
      name: 'a declaration then a call',
      code: lines('const a = 1;', 'a();'),
      output: lines('const a = 1;', '', 'a();'),
      errors: ['Expected a blank line before this expression']
    },
    {
      name: 'a block then a call',
      code: lines('if (a) {', '  b();', '}', 'c();'),
      output: lines('if (a) {', '  b();', '}', '', 'c();'),
      errors: ['Expected a blank line before this expression']
    },
    {
      name: 'a call then a return',
      code: lines('const f = () => {', '  a();', '  return 1;', '};'),
      output: lines('const f = () => {', '  a();', '', '  return 1;', '};'),
      errors: ['Expected a blank line before this return']
    },
    {
      name: 'a multi-line if after a one-line guard',
      code: lines('const f = () => {', '  if (a) return;', '  if (b) {', '    c();', '  }', '};'),
      output: lines(
        'const f = () => {',
        '  if (a) return;',
        '',
        '  if (b) {',
        '    c();',
        '  }',
        '};'
      ),
      errors: ['Expected a blank line before this if']
    },
    {
      name: 'the blank line goes after a trailing comment',
      code: lines('const a = 1; // note', 'a();'),
      output: lines('const a = 1; // note', '', 'a();'),
      errors: 1
    },
    {
      name: 'a comment directly above the next statement is not a blank line',
      code: lines('const a = 1;', '// why', 'a();'),
      output: lines('const a = 1;', '', '// why', 'a();'),
      errors: 1
    },
    {
      name: 'an interface after a multi-line type alias',
      code: lines('type A = {', '  a: 1;', '};', 'interface B {', '  b: 2;', '}'),
      output: lines('type A = {', '  a: 1;', '};', '', 'interface B {', '  b: 2;', '}'),
      errors: ['Expected a blank line before this tsinterface']
    }
  ]
});
