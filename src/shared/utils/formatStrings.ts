export function allFirstLetterToUpperCase(str: string) {
  if (!str) return ''
  return str
    .split(' ')
    .map(word => word.charAt(0).toLocaleUpperCase('fr-FR') + word.slice(1))
    .join(' ')
}

export function oneFirstLetterToUpperCase(str: string) {
  if (!str) return ''
  return str.charAt(0).toLocaleUpperCase('fr-FR') + str.slice(1)
}

export function normalizeKey(key: string) {
  return key.toLowerCase()
}
