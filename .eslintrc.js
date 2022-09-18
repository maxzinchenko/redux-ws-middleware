const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  parser: '@typescript-eslint/parser',

  parserOptions: {
    project: ['tsconfig.json'],
    ecmaVersion: 2021,
    sourceType: 'module'
  },

  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:unicorn/recommended',
    'plugin:jest/recommended'
  ],

  plugins: ['import', 'unicorn', 'jest', 'prettier'],

  env: {
    node: true,
    browser: true,
    es2020: true
  },

  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts']
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true
      }
    }
  },

  rules: {
    // Prettier
    'prettier/prettier': ERROR,
    'prefer-arrow-callback': OFF,
    'react/display-name': OFF,
    'react/prop-types': OFF,

    // Import rules
    'import/named': OFF,
    'import/namespace': OFF,
    'import/default': OFF,
    'import/no-named-as-default-member': OFF,
    'import/no-extraneous-dependencies': OFF,
    'import/no-cycle': ERROR,
    'import/newline-after-import': ERROR,
    'import/order': [
      ERROR,
      {
        'newlines-between': 'always',
        pathGroups: [{ pattern: 'react**', group: 'builtin', position: 'before' }],
        groups: [['builtin', 'external'], ['internal', 'parent', 'index'], ['object', 'type', 'sibling']],
        pathGroupsExcludedImportTypes: []
      }
    ],

    // Unicorn
    'unicorn/no-null': OFF,
    'unicorn/prevent-abbreviations': OFF,
    'unicorn/empty-brace-spaces': ERROR,
    'unicorn/filename-case': OFF,
    'unicorn/prefer-node-protocol': OFF,
    'unicorn/prefer-module': OFF,
    'unicorn/explicit-length-check': OFF,

    // Main
    '@typescript-eslint/lines-between-class-members': [ERROR, 'always', { exceptAfterSingleLine: true }],
    '@typescript-eslint/no-unused-vars': [ERROR, { argsIgnorePattern: '^_$' }],
    '@typescript-eslint/comma-dangle': [ERROR, 'never'],

    'arrow-body-style': OFF,
    'arrow-spacing': ERROR,
    'react/jsx-filename-extension': OFF,
    'max-params': [ERROR, 6],
    'max-len': [
      ERROR,
      { code: 120, ignorePattern: "(?:^import |export|Path|Rect|Svg|LinearGradient)|(?:it|describe)\\('[\\w\\s]+'" }
    ],
    'comma-dangle': [ERROR, 'never']
  }
};
