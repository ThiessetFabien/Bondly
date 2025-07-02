module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Configuration très permissive pour gitmoji
    'type-empty': [0],
    'type-enum': [0],
    'subject-empty': [0], // Désactivé car complexe avec gitmoji
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [0],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
  },
}
