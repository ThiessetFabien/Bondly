'use client'

import { useCallback } from 'react'

/**
 * Hook pour améliorer les interactions avec la navigation
 * Ajoute du feedback tactile et sonore pour une meilleure UX
 */
export function useNavigationInteractions() {
  // Feedback tactile (vibration) pour mobile
  const triggerHaptic = useCallback(
    (type: 'light' | 'medium' | 'heavy' = 'light') => {
      if ('navigator' in window && 'vibrate' in navigator) {
        const patterns: Record<'light' | 'medium' | 'heavy', number[]> = {
          light: [10],
          medium: [20],
          heavy: [30],
        }
        navigator.vibrate(patterns[type])
      }
    },
    []
  )

  // Feedback sonore (optionnel)
  const triggerSound = useCallback(
    (type: 'click' | 'success' | 'toggle' = 'click') => {
      // Utilise l'API Web Audio si disponible
      if ('AudioContext' in window || 'webkitAudioContext' in window) {
        try {
          const AudioContext =
            window.AudioContext ||
            (
              window as unknown as {
                webkitAudioContext: typeof window.AudioContext
              }
            ).webkitAudioContext
          const audioContext = new AudioContext()

          const frequencies = {
            click: 800,
            success: 1000,
            toggle: 600,
          }

          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.setValueAtTime(
            frequencies[type],
            audioContext.currentTime
          )
          oscillator.type = 'sine'

          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.1
          )

          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.1)
        } catch {
          // Silence les erreurs audio
        }
      }
    },
    []
  )

  // Feedback combiné pour les interactions principales
  const handleMenuToggle = useCallback(() => {
    triggerHaptic('medium')
    triggerSound('toggle')
  }, [triggerHaptic, triggerSound])

  const handleNavClick = useCallback(() => {
    triggerHaptic('light')
    triggerSound('click')
  }, [triggerHaptic, triggerSound])

  const handleSuccess = useCallback(() => {
    triggerHaptic('heavy')
    triggerSound('success')
  }, [triggerHaptic, triggerSound])

  return {
    triggerHaptic,
    triggerSound,
    handleMenuToggle,
    handleNavClick,
    handleSuccess,
  }
}
