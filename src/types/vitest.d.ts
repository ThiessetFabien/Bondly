// Types globaux pour Vitest et Testing Library
import '@testing-library/jest-dom'
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare global {
  namespace Vi {
    interface JestAssertion<T = unknown>
      extends jest.Matchers<void>,
        TestingLibraryMatchers<string, T> {}
  }
}

// Augmentation des types Vitest pour Testing Library
declare module 'vitest' {
  interface Assertion<T = unknown>
    extends jest.Matchers<void>,
      TestingLibraryMatchers<string, T> {}
  interface AsymmetricMatchersContaining
    extends jest.Matchers<void>,
      TestingLibraryMatchers<string, unknown> {}
}
