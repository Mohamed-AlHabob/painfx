module.exports = {
  extends: 'expo',
  ignorePatterns: ['/dist/*'],
  settings: {
    'import/resolver': {
      node: {
        paths: ['app', 'locales','components', 'hooks', 'constants'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  
};
