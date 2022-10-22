const MAX_ARGUMENTS = 5;
const INDENT = 2;

module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true,
    'es6': true,
    'node': true,
  },
  'extends': ['eslint:recommended', 'plugin:i18next/recommended', 'plugin:import/recommended', 'plugin:react/recommended'],
  'parser': '@babel/eslint-parser',
  'parserOptions': {
    'allowImportExportEverywhere': false,
    'ecmaFeatures': {
      'globalReturn': false,
    },
    'requireConfigFile': false,
    'sourceType': 'module',
  },
  'plugins': ['i18next', 'import', 'sort-imports-requires', 'filenames', 'arguments', 'react', 'no-loops'],
  'rules': {
    'arrow-parens': ['error', 'as-needed'],
    'filenames/match-exported': 2,
    'filenames/match-regex': [2, '^[a-zA-Z_.][a-zA-Z0-9]+$', true],
    'filenames/no-index': 2,
    'func-style': ['error', 'declaration', {'allowArrowFunctions': true}],
    'indent': [
      'error',
      INDENT,
      {
        'SwitchCase': 1,
        'flatTernaryExpressions': true,
        'offsetTernaryExpressions': false,
      },
    ],
    'linebreak-style': [
      'error',
      'windows',
    ],
    'max-params': ['error', MAX_ARGUMENTS],
    'no-console': 'error',
    'no-duplicate-imports': 'error',
    //'no-magic-numbers': 'error',
    'no-lonely-if': 'error',
    'no-loops/no-loops': 2,
    'no-multi-assign': 'error',
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-multiple-empty-lines': 'error',
    'no-negated-condition': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-return-assign': 'error',
    'no-trailing-spaces': 'error',
    'no-unneeded-ternary': 'error',
    'no-useless-rename': 'error',
    'no-var': 'error',
    'no-void': 'error',
    'no-whitespace-before-property': 'error',
    'operator-linebreak': ['error', 'before'],
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'quotes': [
      'error',
      'single',
    ],
    'require-await': 'error',
    'semi': [
      'error',
      'always',
    ],
    'sort-imports-requires/sort-imports': 'error',
    'sort-imports-requires/sort-requires': 'error',
  },
  'settings': {
    'react': {
      'version': 'detect',
    },
  },
};