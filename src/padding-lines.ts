import { eslintCompatPlugin } from '@oxlint/plugins';
import createPaddingLineRule from './anti-slop/vendor/eslint-stylistic/padding-line-between-statements.ts';
import type { StatementOption } from './anti-slop/vendor/eslint-stylistic/padding-line-options.ts';

const DECLARATIONS: StatementOption = ['const', 'let', 'var', 'using'];

const SINGLE_LINE_DECLARATIONS: StatementOption = [
  'singleline-const',
  'singleline-let',
  'singleline-var',
  'singleline-using'
];

const MULTI_LINE_DECLARATIONS: StatementOption = [
  'multiline-const',
  'multiline-let',
  'multiline-var',
  'multiline-using'
];

const DEFINITIONS: StatementOption = ['function', 'class', 'interface', 'type'];

const CONTROL_FLOW: StatementOption = [
  'return',
  'throw',
  'if',
  'switch',
  'try',
  'for',
  'while',
  'do'
];

const TOP_LEVEL: StatementOption = { selector: 'Program > :not(ImportDeclaration)' };

const OVERLOAD: StatementOption = {
  selector:
    ':matches(TSDeclareFunction, ExportNamedDeclaration[declaration.type="TSDeclareFunction"])'
};

const OVERLOAD_OR_IMPLEMENTATION: StatementOption = {
  selector:
    ':matches(TSDeclareFunction, FunctionDeclaration, ExportNamedDeclaration[declaration.type="TSDeclareFunction"], ExportNamedDeclaration[declaration.type="FunctionDeclaration"])'
};

// The last matching entry wins, so each exception follows the demand it relaxes.
export const paddingLines = createPaddingLineRule([
  { blankLine: 'always', prev: '*', next: DEFINITIONS },
  { blankLine: 'always', prev: DEFINITIONS, next: '*' },
  { blankLine: 'always', prev: '*', next: MULTI_LINE_DECLARATIONS },
  { blankLine: 'always', prev: DECLARATIONS, next: '*' },
  { blankLine: 'any', prev: SINGLE_LINE_DECLARATIONS, next: SINGLE_LINE_DECLARATIONS },
  { blankLine: 'always', prev: '*', next: CONTROL_FLOW },
  { blankLine: 'always', prev: 'block-like', next: '*' },
  { blankLine: 'always', prev: 'import', next: '*' },
  { blankLine: 'always', prev: '*', next: TOP_LEVEL },
  { blankLine: 'always', prev: TOP_LEVEL, next: '*' },
  { blankLine: 'any', prev: 'import', next: 'import' },
  { blankLine: 'any', prev: OVERLOAD, next: OVERLOAD_OR_IMPLEMENTATION }
]);

export default eslintCompatPlugin({
  meta: { name: 'r1' },
  rules: { 'padding-lines': paddingLines }
});
