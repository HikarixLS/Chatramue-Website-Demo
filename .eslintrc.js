module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {
    // Vue specific rules
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-vars': 'error',
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/prop-name-casing': ['error', 'camelCase'],
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/v-on-event-hyphenation': ['error', 'always'],
    
    // General JavaScript rules
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': ['error', { 
      vars: 'all', 
      args: 'after-used',
      ignoreRestSiblings: true 
    }],
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': 'error',
    'arrow-spacing': 'error',
    'comma-dangle': ['error', 'only-multiline'],
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'eol-last': 'error',
    'no-trailing-spaces': 'error',
    'space-before-function-paren': ['error', 'always'],
    'keyword-spacing': 'error',
    'space-infix-ops': 'error',
    'comma-spacing': 'error',
    'brace-style': ['error', '1tbs'],
    'curly': ['error', 'multi-line'],
    
    // Performance & Best Practices
    'no-await-in-loop': 'warn',
    'no-return-await': 'error',
    'prefer-arrow-callback': 'error',
    'no-duplicate-imports': 'error',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'array-callback-return': 'error',
    'consistent-return': 'error'
  },
  overrides: [
    {
      files: ['**/*.vue'],
      rules: {
        'indent': 'off'
      }
    },
    {
      files: ['*.config.js', 'vite.config.js'],
      env: {
        node: true
      }
    }
  ],
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.min.js',
    'public/',
    'coverage/'
  ]
}
