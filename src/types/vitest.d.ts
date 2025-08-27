// Types globaux pour Vitest et Testing Library
import '@testing-library/jest-dom'

declare global {
  namespace Vi {
    interface JestAssertion<T = unknown> {
      // Testing Library matchers will be automatically available
    }
  }
}
