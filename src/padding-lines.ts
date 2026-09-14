import {
  type Comment,
  type Context,
  definePlugin,
  defineRule,
  type ESTree,
  type Token
} from '@oxlint/plugins';

type Statement = ESTree.Program['body'][number];

const BLANK_LINE_BEFORE: ReadonlySet<string> = new Set([
  'ReturnStatement',
  'ThrowStatement',
  'IfStatement',
  'ForStatement',
  'ForInStatement',
  'ForOfStatement',
  'WhileStatement',
  'DoWhileStatement',
  'SwitchStatement',
  'TryStatement',
  'FunctionDeclaration',
  'ClassDeclaration',
  'ExportNamedDeclaration',
  'ExportDefaultDeclaration',
  'ExportAllDeclaration',
  'TSInterfaceDeclaration',
  'TSTypeAliasDeclaration'
]);

const isDeclaration = (statement: Statement) => statement.type === 'VariableDeclaration';

const isSingleLine = (statement: Statement) => statement.loc.start.line === statement.loc.end.line;

const isGuard = (statement: Statement) =>
  statement.type === 'IfStatement' && isSingleLine(statement);

const isImport = (statement: Statement) => statement.type === 'ImportDeclaration';

const isOneLineExport = (statement: Statement) =>
  statement.type === 'ExportNamedDeclaration' && isSingleLine(statement);

const endsWithBlock = (statement: Statement, context: Context) =>
  context.sourceCode.getLastToken(statement)?.value === '}';

const TIGHT_RUNS = [isImport, isDeclaration, isGuard, isOneLineExport];

// A run of imports, declarations, guards, or one-line exports stays tight; everything else gets a blank line.
const needsBlankLineBetween = (previous: Statement, next: Statement, context: Context) => {
  if (TIGHT_RUNS.some((isKind) => isKind(previous) && isKind(next))) return false;
  if (isDeclaration(previous) || endsWithBlock(previous, context)) return true;

  return BLANK_LINE_BEFORE.has(next.type);
};

const getTokenOrCommentAfter = (token: Token | Comment, context: Context) =>
  context.sourceCode.getTokenAfter(token, { includeComments: true });

const lastTokenOnItsLine = (statement: Statement, context: Context) => {
  let token: Token | Comment = context.sourceCode.getLastToken(statement)!;

  for (;;) {
    const following = getTokenOrCommentAfter(token, context);

    if (following === null || following.loc.start.line !== token.loc.end.line) return token;
    token = following;
  }
};

const hasBlankLineBetween = (previous: Statement, next: Statement, context: Context) => {
  let token = lastTokenOnItsLine(previous, context);

  while (token.range[0] < next.range[0]) {
    const following = getTokenOrCommentAfter(token, context);

    if (following === null) return false;
    if (following.loc.start.line - token.loc.end.line >= 2) return true;
    token = following;
  }

  return false;
};

const getKindOf = (statement: Statement) =>
  statement.type.replace(/Statement|Declaration$/, '').toLowerCase();

const checkBody = (context: Context, statements: ReadonlyArray<Statement>) => {
  for (let index = 1; index < statements.length; index++) {
    const previous = statements[index - 1]!;
    const next = statements[index]!;

    if (!needsBlankLineBetween(previous, next, context)) continue;
    if (hasBlankLineBetween(previous, next, context)) continue;
    context.report({
      node: next,
      message: `Expected a blank line before this ${getKindOf(next)}`,
      fix: (fixer) => fixer.insertTextAfter(lastTokenOnItsLine(previous, context), '\n')
    });
  }
};

export const paddingLines = defineRule({
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    docs: {
      description:
        'Requires a blank line between statements, except inside a run of imports, declarations, one-line guards, or one-line exports.'
    }
  },
  createOnce(context) {
    return {
      Program: (node) => checkBody(context, node.body),
      BlockStatement: (node) => checkBody(context, node.body)
    };
  }
});

export default definePlugin({
  meta: { name: 'r1' },
  rules: { 'padding-lines': paddingLines }
});
