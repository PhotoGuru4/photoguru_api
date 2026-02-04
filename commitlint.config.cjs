module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'scope-pattern': (parsed) => {
          const { scope } = parsed;
          const pattern = /^[A-Z]+-\d+$/;
          
          if (!scope) {
            return [false, 'scope is required (e.g., feat(PROJ-123): ...)'];
          }
          
          if (!pattern.test(scope)) {
            return [false, `scope must match [A-Z]+-\\d+ (Your scope: "${scope}")` ];
          }
          
          return [true];
        },
      },
    },
  ],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'chore', 'docs', 'refactor', 'style', 'test']],
    'scope-empty': [2, 'never'],
    'scope-pattern': [2, 'always'], 
    'header-max-length': [2, 'always', 100],
  },
};