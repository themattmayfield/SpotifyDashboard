const typescriptExtendedRules = require('./typescriptExtendedRules.js');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: 'next/core-web-vitals',
  parserOptions: {
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    project: './tsconfig.eslint.json'
  },
  rules: {
    ...typescriptExtendedRules,
    'no-restricted-exports': [
      'off',
      {
        restrictedNamedExports: ['default']
      }
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'clsx',
            message:
              'Please use `import { cn } @surecraft-apps/common/services` instead'
          },
          {
            name: 'classnames',
            message:
              'Please use `import { cn } @surecraft-apps/common/services` instead'
          }
        ]
      }
    ],
    'react/react-in-jsx-scope': 0,
    'react/display-name': 0,
    'react/prop-types': 0,
    'react/jsx-no-duplicate-props': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-unused-vars': [2],
    'no-console': [
      2,
      {
        allow: ['warn', 'error']
      }
    ]
  }
};
