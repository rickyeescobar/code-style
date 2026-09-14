import type { OxfmtConfig } from 'oxfmt';

export const format = {
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  printWidth: 100,
  arrowParens: 'always',
  experimentalOperatorPosition: 'start',
  singleAttributePerLine: true,
  bracketSameLine: true,
  sortPackageJson: false,
  sortImports: { newlinesBetween: false }
} as const satisfies OxfmtConfig;
