# @r1-dev/code-style

Opinionated [oxlint](https://oxc.rs/docs/guide/usage/linter) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter) configuration for TypeScript projects, in one package:

- an oxlint **base config** and a **React add-on**,
- a **`padding-lines`** rule that enforces blank-line discipline, with an autofix,
- the **oxfmt options**.

The goal is code that reads the same in every repository that adopts it: one statement per thought, a blank line between thoughts, no function you cannot hold in your head.

## Install

```sh
pnpm add -D @r1-dev/code-style oxlint oxfmt
```

`oxlint` (1.83 or later) and `oxfmt` (0.68 or later) are peer dependencies. The Node-based `oxlint` package and Node 22.18 or later are required, because the configs are TypeScript files.

## Use

Two config files at the repository root. Each one imports the shared rules and adds only what is specific to that repository.

```ts
// oxlint.config.ts
import { base, react } from '@r1-dev/code-style/oxlint';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [base, react],
  ignorePatterns: ['src/generated/**']
});
```

```ts
// oxfmt.config.ts
import { format } from '@r1-dev/code-style/oxfmt';
import { defineConfig } from 'oxfmt';

export default defineConfig({
  ...format,
  sortImports: { ...format.sortImports, internalPattern: ['@acme/'] }
});
```

Leave out `react` in a project without React. Add scripts:

```json
{
  "scripts": {
    "lint": "oxlint",
    "lint:fix": "oxlint --fix",
    "format": "oxfmt",
    "format:check": "oxfmt --check"
  }
}
```

The first `lint:fix` and `format` on an existing codebase is a large commit. After that, the rules hold on every save and in CI.

## What the rules say

### Formatting (`oxfmt`)

| Option                         | Value     | Why                                                            |
| ------------------------------ | --------- | -------------------------------------------------------------- |
| `printWidth`                   | `100`     | Wide enough for a real name, narrow enough for two panes.      |
| `semi`                         | `true`    | No ASI surprises.                                              |
| `singleQuote`                  | `true`    | Less noise around the most common literal.                     |
| `trailingComma`                | `"none"`  | A list ends where it ends.                                     |
| `arrowParens`                  | `"always"`| One shape for every arrow.                                     |
| `experimentalOperatorPosition` | `"start"` | A wrapped condition reads as a list of clauses.                |
| `singleAttributePerLine`       | `true`    | A JSX element with two attributes reads like an object.        |
| `bracketSameLine`              | `true`    | The closing `>` stays with the last attribute.                 |
| `sortImports`                  | on        | External, then internal, then relative, no groups by blank line. |

### Linting (`oxlint`)

- The `correctness`, `suspicious`, and `perf` categories are errors.
- **Type imports are explicit and inline**: `import { type Foo, bar }`.
- **Arrays are `Array<T>` and `ReadonlyArray<T>`**, never `T[]`.
- **No `console`** outside tests, seeds, scripts, and config files.
- **`complexity` is capped at 10.** A function past the cap is split into named steps. There is no autofix for this one by design.
- A long list of stylistic rules is turned **off** where the formatter or the type checker already decides, or where the rule fights idiomatic TypeScript (`no-non-null-assertion`, `no-explicit-any`, `no-namespace`, and others). See [`src/oxlint/index.ts`](src/oxlint/index.ts).

### `r1/padding-lines`

A blank line separates statements, except inside a **run** of statements of the same tight kind:

- imports,
- variable declarations,
- one-line guards (`if (x) return;`),
- one-line exports.

The same rules apply inside a `switch` case. A statement that ends with a block, or a declaration, is always followed by a blank line. A `return`, `throw`, loop, `if`, `switch`, `try`, function, class, export, interface, or type alias always gets a blank line before it. Comments travel with the statement under them: a blank line above a comment counts for that statement.

```ts
const rows = await load();
const first = rows[0];

if (first === undefined) return null;
if (first.isStale) return refresh(first);

for (const row of rows) {
  mark(row);
}

return first;
```

The rule is autofixable. `oxlint --fix` inserts the missing lines and never removes any.

## Compatibility

- **oxlint** 1.83 or later, Node-based package. JS plugins and TypeScript configs are marked experimental by oxlint; this package tracks them and pins a minimum.
- **oxfmt** 0.68 or later.
- **Node** 22.18 or later.

## Versioning

[Semantic versioning](https://semver.org). A change that makes previously passing code fail lint or change under the formatter is a **major** version. New rules that are off by default, and fixes, are minor or patch. Every release is listed in [CHANGELOG.md](CHANGELOG.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Rule proposals are welcome as issues that include a before-and-after code sample.

## License

[MIT](LICENSE)
