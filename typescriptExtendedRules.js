module.exports = {
  /**
   * @typescript-eslint rules
   * https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/docs/rules
   */
  '@typescript-eslint/array-type': 'error',
  '@typescript-eslint/consistent-indexed-object-style': 'error',
  '@typescript-eslint/consistent-type-imports': 'error',
  '@typescript-eslint/naming-convention': [
    'error',
    {
      selector: 'typeAlias',
      format: ['PascalCase'],
      prefix: ['T', 'E']
    },
    {
      selector: 'interface',
      format: ['PascalCase'],
      prefix: ['I']
    },
    {
      selector: 'variable',
      types: ['boolean'],
      format: ['PascalCase'],
      prefix: [
        'are',
        'can',
        'did',
        'does',
        'has',
        'have',
        'is',
        'should',
        'was',
        'will',
        '_'
      ]
    }
  ],
  '@typescript-eslint/no-unused-expressions': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true
    }
  ],
  /**
   * ESLint rules we don't need for TypeScript projects
   * (or @typescript-eslint covers these)
   */
  'consistent-return': 'off',
  'no-shadow': 'off',
  'no-unused-vars': 'off',
  'no-use-before-define': 'off'
};
