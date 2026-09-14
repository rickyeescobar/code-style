---
name: Rule proposal
about: Propose a new rule, a new formatter option, or a change to an existing one
labels: proposal
---

## What the rule says

One or two sentences, in the style of the README's "What the rules say" section.

## Before

```ts
// Code that passes today and should fail, or the other way round.
```

## After

```ts
// The same code, as the rule would have it.
```

## Why

What goes wrong without the rule, or what it makes easier to read.

## Breaking?

Does code that passes lint or survives the formatter today change under this
proposal? If yes, this is a major version and the discussion belongs here first.
