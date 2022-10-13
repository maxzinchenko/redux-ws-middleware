module.exports = {
  useTabs: false,
  tabSize: 2,
  singleQuote: true,
  printWidth: 120,
  endOfLine: 'lf',
  trailingComma: 'none',
  bracketSameLine: false,
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 70,
        useTabs: false,
        trailingComma: 'none',
        arrowParens: 'avoid',
        proseWrap: 'never',
      },
    },
  ],
};
