module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  settings: {
    typescript: {
      alwaysTryTypes: true,
    },
  },
  rules: {
    'import/no-absolute-path': 'error',
    'import/no-useless-path-segments': 'warn',
    'import/no-deprecated': 'warn',
    'import/no-extraneous-dependencies': 'error',
    'import/extensions': 'error',
    'import/order': 'warn',
    'import/no-anonymous-default-export': 'warn',
    '@typescript-eslint/no-empty-interface': 'off',
  },
};
