# anti-slop (vendored)

Upstream: https://github.com/dmmulroy/anti-slop at `c44ef22ca116d0ba62a3ff663a0bd13a3f3fa40b` (2026-09-10), MIT (`LICENSE` in this directory).

This is the upstream `src/` directory, tests included; `test/anti-slop-upstream.test.ts` runs every `*.test.ts` here on Node's test runner, and the build leaves them out. It is published as `@r1-dev/code-style/anti-slop` and `@r1-dev/code-style/anti-slop-effect`; the `base` and `effect` configs in `src/oxlint/index.ts` turn the rules on. The directory is excluded from this repository's own lint and format so an upstream diff stays readable.

Local edits:

- `shared/dictionary-types.ts`: `unsafeMembers[0] ?? null`, because this package compiles with `noUncheckedIndexedAccess`.
- `vendor/eslint-stylistic/padding-line-options.d.ts` is renamed to `padding-line-options.ts` so the build emits it next to the engine that imports it.
- `rules/require-readable-spacing.ts` ships but `base` leaves it off: `r1/padding-lines` in `src/padding-lines.ts` configures the same vendored engine with a superset of its pairs.

To update, diff a fresh upstream `src/` against this directory and reapply the edits above.
