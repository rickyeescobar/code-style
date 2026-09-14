# Contributing

## Setup

```sh
pnpm install
pnpm check
```

`check` runs the type check, the linter, the format check, the rule tests, and the build. CI runs the same command.

## Layout

| Path                    | Holds                                                         |
| ----------------------- | ------------------------------------------------------------- |
| `src/oxlint/index.ts`   | The `base` and `react` oxlint configs.                        |
| `src/oxfmt.ts`          | The formatter options.                                        |
| `src/padding-lines.ts`  | The `r1/padding-lines` rule and the plugin that exports it.   |
| `test/`                 | Rule tests, run with oxlint's `RuleTester` on Node's test runner.  |

The repository lints and formats itself with the configs in `src`, through `oxlint.config.ts` and `oxfmt.config.ts` at the root.

## Changing a rule

1. Open an issue first if the change makes code that passes today fail tomorrow. That is a major version and deserves a discussion with a before-and-after sample.
2. Add or update a test case in `test/` for a rule with logic. A config change needs no test.
3. Add a line under **Unreleased** in `CHANGELOG.md`.

## Style

The code in this repository follows its own rules. `pnpm lint:fix` and `pnpm format` apply them. Comments explain a consequence or an ordering, never what the code says.

## Releasing

Maintainers only.

1. Move the **Unreleased** entries in `CHANGELOG.md` under the new version and date.
2. Bump `version` in `package.json` on the same commit.
3. Tag it `v<version>` and push the tag. The release workflow runs `check` and publishes to npm with provenance.
