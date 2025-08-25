// Types pour l'accessibilité navigation
export interface AccessibilityPreferences {
  reducedMotion: boolean
  highContrast: boolean
  touchDevice: boolean
  getAnimationClasses: (baseClasses: string) => string
  getMotionVariants: <T extends Record<string, unknown>>(normalVariants: T) => T
}

export interface KeyboardNavigation {
  isKeyboardUser: boolean
  focusClasses: string
}
