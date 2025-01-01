module.exports = {
  extends: 'expo',
  ignorePatterns: ['/dist/*'],
  settings: {
    'import/resolver': {
      node: {
        paths: ['/'], // Ensure ESLint knows where to resolve imports
        extensions: ['.js', '.jsx', '.ts', '.tsx'], // Add relevant extensions
      },
      alias: {
        map: [['@', './src']], // Define your alias
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
