module.exports = {
  extends: ['gitmoji'],
  rules: {
    // Type conventionnel obligatoire
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'ci',
        'build',
        'revert',
        'security',
        'config',
      ],
    ],

    // Message obligatoire et de qualité
    'subject-empty': [2, 'never'],
    'subject-min-length': [2, 'always', 5],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [2, 'always', ['sentence-case', 'lower-case']],

    // Limites de longueur
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
  },
}
