module.exports = {
  singleQuote: true,
  overrides: [
    {
      files: ['**/*.json', '**/*.html'],
      options: {
        singleQuote: false,
      },
    },
  ],
};
