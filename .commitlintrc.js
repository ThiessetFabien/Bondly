module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Autoriser les emojis en début de message
    'subject-case': [0, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nouvelle fonctionnalité
        'fix',      // Correction de bug
        'docs',     // Documentation
        'style',    // Changements de style (formatting, etc.)
        'refactor', // Refactoring
        'perf',     // Amélioration des performances
        'test',     // Ajout ou modification de tests
        'chore',    // Tâches de maintenance
        'ci',       // Changements CI/CD
        'build',    // Changements du système de build
        'revert',   // Annulation d'un commit précédent
        'wip',      // Work in progress
        'init',     // Commit initial
      ],
    ],
    // Configuration pour les messages avec gitmoji
    'type-empty': [0], // Permet les commits sans type si gitmoji est utilisé
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 72],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
  },
  // Configuration pour accepter les gitmojis
  parserPreset: {
    parserOpts: {
      headerPattern: /^(?::([\w-]*):)?\s?(?:(\w*)(?:\((.+)\))?\s?:\s?)?(.*?)(?:\s\(#(\d+)\))?$/,
      headerCorrespondence: ['emoji', 'type', 'scope', 'subject', 'ticket'],
    },
  },
};
