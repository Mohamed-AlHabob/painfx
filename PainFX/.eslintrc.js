module.exports = {
  extends: 'expo',
  ignorePatterns: ['/dist/*'],
  settings: {
    'import/resolver': {
      node: {
        paths: ['app','components'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      alias: {
        map: [['@', './components']],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
