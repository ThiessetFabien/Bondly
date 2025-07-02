module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type obligatoire
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat', // Nouvelle fonctionnalité
        'fix', // Correction de bug
        'docs', // Documentation
        'style', // Changements de style (formatting, etc.)
        'refactor', // Refactoring
        'perf', // Amélioration des performances
        'test', // Ajout ou modification de tests
        'chore', // Tâches de maintenance
        'ci', // Changements CI/CD
        'build', // Changements du système de build
        'revert', // Annulation d'un commit précédent
        'wip', // Work in progress
        'init', // Commit initial
      ],
    ],
    // Sujet obligatoire
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [2, 'always', 'lower-case'],
    // Longueur
    'header-max-length': [2, 'always', 72],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
  },
}
