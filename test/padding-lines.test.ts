import { describe, it } from 'node:test';
import { RuleTester } from 'oxlint/plugins-dev';
import { paddingLines } from '../src/padding-lines.ts';

RuleTester.describe = describe;

RuleTester.it = it;

const tester = new RuleTester({ languageOptions: { parserOptions: { lang: 'ts' } } });

const lines = (...parts: ReadonlyArray<string>) => parts.join('\n') + '\n';

const inBody = (...parts: ReadonlyArray<string>) =>
  lines('const f = () => {', ...parts.map((part) => (part === '' ? '' : `  ${part}`)), '};');

const expected = 'Expected blank line before this statement.';

tester.run('padding-lines', paddingLines, {
  valid: [
    { name: 'imports stay tight', code: lines("import a from 'a';", "import b from 'b';") },
    {
      name: 'one-line declarations stay tight inside a body',
      code: inBody('const a = 1;', 'const b = 2;', '', 'return a + b;')
    },
    { name: 'calls stay tight inside a body', code: inBody('a();', 'b();') },
    {
      name: 'a call then a one-line declaration stays tight',
      code: inBody('a();', 'const b = 1;', '', 'return b;')
    },
    {
      name: 'overloads stay with their implementation',
      code: lines(
        'function f(a: string): string;',
        'function f(a: number): number;',
        'function f(a: unknown) {',
        '  return a;',
        '}'
      )
    },
    {
      name: 'a blank line separates one-line guards',
      code: inBody('if (a) return 0;', '', 'if (b) return 9;', '', 'return 1;')
    },
    { name: 'a blank line after a declaration', code: inBody('const a = 1;', '', 'a();') },
    { name: 'a blank line after a block', code: inBody('if (a) {', '  b();', '}', '', 'c();') },
    { name: 'a blank line before a return', code: inBody('a();', '', 'return 1;') },
    { name: 'a blank line before a throw', code: inBody('a();', '', "throw new Error('b');") },
    {
      name: 'a blank line above a comment counts for the statement under it',
      code: inBody('a();', '', '// why', 'return;')
    },
    {
      name: 'a switch case body follows the same rules',
      code: lines(
        'switch (x) {',
        '  case 1:',
        '    a();',
        '',
        '    return;',
        '  default:',
        '    b();',
        '}'
      )
    },
    {
      name: 'every top-level statement stands alone',
      code: lines("import a from 'a';", '', 'const b = a;', '', 'export const c = b;')
    }
  ],
  invalid: [
    {
      name: 'a declaration then a call',
      code: inBody('const a = 1;', 'a();'),
      output: inBody('const a = 1;', '', 'a();'),
      errors: [expected]
    },
    {
      name: 'a block then a call',
      code: inBody('if (a) {', '  b();', '}', 'c();'),
      output: inBody('if (a) {', '  b();', '}', '', 'c();'),
      errors: [expected]
    },
    {
      name: 'a call then a return',
      code: inBody('a();', 'return 1;'),
      output: inBody('a();', '', 'return 1;'),
      errors: [expected]
    },
    {
      name: 'a call then a throw',
      code: inBody('a();', "throw new Error('b');"),
      output: inBody('a();', '', "throw new Error('b');"),
      errors: [expected]
    },
    {
      name: 'a one-line guard after another',
      code: inBody('if (a) return;', 'if (b) return;'),
      output: inBody('if (a) return;', '', 'if (b) return;'),
      errors: [expected]
    },
    {
      name: 'a multi-line declaration after a one-line one',
      code: inBody('const a = 1;', 'const b = {', '  a', '};', '', 'return b;'),
      output: inBody('const a = 1;', '', 'const b = {', '  a', '};', '', 'return b;'),
      errors: [expected]
    },
    {
      name: 'a one-line declaration after a multi-line one',
      code: inBody('const a = {', '  b: 1', '};', 'const c = 2;', '', 'return c;'),
      output: inBody('const a = {', '  b: 1', '};', '', 'const c = 2;', '', 'return c;'),
      errors: [expected]
    },
    {
      name: 'the blank line goes after a trailing comment',
      code: inBody('const a = 1; // note', 'a();'),
      output: inBody('const a = 1; // note', '', 'a();'),
      errors: [expected]
    },
    {
      name: 'a comment directly above the next statement is not a blank line',
      code: inBody('const a = 1;', '// why', 'a();'),
      output: inBody('const a = 1;', '', '// why', 'a();'),
      errors: [expected]
    },
    {
      name: 'an interface after a multi-line type alias',
      code: lines('type A = {', '  a: 1;', '};', 'interface B {', '  b: 2;', '}'),
      output: lines('type A = {', '  a: 1;', '};', '', 'interface B {', '  b: 2;', '}'),
      errors: [expected]
    },
    {
      name: 'a declaration then a return inside a switch case without braces',
      code: lines('switch (x) {', '  case 1:', '    const a = 1;', '    return a;', '}'),
      output: lines('switch (x) {', '  case 1:', '    const a = 1;', '', '    return a;', '}'),
      errors: [expected]
    },
    {
      name: 'two top-level one-line declarations',
      code: lines('const a = 1;', 'const b = 2;'),
      output: lines('const a = 1;', '', 'const b = 2;'),
      errors: [expected]
    },
    {
      name: 'two top-level one-line exports',
      code: lines('export const a = 1;', 'export const b = 2;'),
      output: lines('export const a = 1;', '', 'export const b = 2;'),
      errors: [expected]
    },
    {
      name: 'an import then a declaration',
      code: lines("import a from 'a';", 'const b = a;'),
      output: lines("import a from 'a';", '', 'const b = a;'),
      errors: [expected]
    },
    {
      name: 'two top-level calls',
      code: lines('a();', 'b();'),
      output: lines('a();', '', 'b();'),
      errors: [expected]
    }
  ]
});
