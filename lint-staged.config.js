module.exports = {
  // Fichiers TypeScript et JavaScript
  '*.{js,jsx,ts,tsx}': [
    'next lint --fix',
    'prettier --write',
  ],
  // Fichiers de style
  '*.{css,scss,sass}': [
    'prettier --write',
  ],
  // Fichiers JSON
  '*.{json,jsonc}': [
    'prettier --write',
  ],
  // Fichiers Markdown
  '*.{md,mdx}': [
    'prettier --write',
  ],
  // Fichiers de configuration
  '*.{yml,yaml}': [
    'prettier --write',
  ],
};
