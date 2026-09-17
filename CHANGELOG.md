# Changelog

All notable changes to this package are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the package follows [Semantic Versioning](https://semver.org).

## 0.2.0 - 2026-09-17

Code that passed 0.1 can fail 0.2: the anti-slop rules are on in `base`, and `r1/padding-lines` asks for more blank lines. Run `oxlint --fix` and the formatter once after upgrading.

### Added

- `@r1-dev/code-style/anti-slop` and `@r1-dev/code-style/anti-slop-effect`: the [anti-slop](https://github.com/dmmulroy/anti-slop) plugins, vendored at `c44ef22`. `base` turns on every generic rule except `require-readable-spacing`, plus `oxc/no-accumulating-spread`.
- `effect`: an opt-in config that turns on the five Effect rules.

### Changed

- `r1/padding-lines` is now a configuration of the vendored ESLint Stylistic engine that anti-slop's `require-readable-spacing` wraps, with the union of both rules' demands. New demands: a blank line between every pair of top-level statements, between one-line guards, and on both sides of a multi-line declaration. Kept from before: a blank line after a declaration before a use and before `throw`. Overload signatures now stay with their implementation.

## 0.1.1 - 2026-09-14

### Changed

- No changes to the package. First release published from CI through npm trusted publishing, with provenance.

## 0.1.0 - 2026-09-14

### Added

- `@r1-dev/code-style/oxlint`: the `base` config (TypeScript, import, oxc, eslint, and unicorn plugins; `correctness`, `suspicious`, and `perf` as errors; explicit inline type imports; generic array types; `complexity` at 10) and the `react` add-on.
- `@r1-dev/code-style/padding-lines`: the `r1/padding-lines` rule with an autofix.
- `@r1-dev/code-style/oxfmt`: the formatter options.
