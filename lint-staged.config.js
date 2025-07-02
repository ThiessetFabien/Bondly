module.exports = {
  // Fichiers TypeScript et JavaScript (excluant les fichiers de config)
  '*.{js,jsx,ts,tsx}': ['prettier --write'],
  // Fichiers TypeScript/JavaScript dans src/ uniquement
  'src/**/*.{js,jsx,ts,tsx}': ['next lint --fix --file'],
  // Fichiers de style
  '*.{css,scss,sass}': ['prettier --write'],
  // Fichiers JSON
  '*.{json,jsonc}': ['prettier --write'],
  // Fichiers Markdown
  '*.{md,mdx}': ['prettier --write'],
  // Fichiers de configuration
  '*.{yml,yaml}': ['prettier --write'],
}
