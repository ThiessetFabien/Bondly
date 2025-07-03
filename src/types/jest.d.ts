// Types globaux pour les tests
import '@testing-library/jest-dom'

// Types strictes pour les tests
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveClass(className: string): R
      toHaveStyle(style: string | Record<string, unknown>): R
      toHaveTextContent(text: string | RegExp): R
      toBeVisible(): R
      toBeDisabled(): R
      toBeEnabled(): R
      toBeChecked(): R
      toHaveValue(value: string | number): R
      toHaveDisplayValue(value: string | string[]): R
      toHaveFormValues(values: Record<string, unknown>): R
      toHaveFocus(): R
      toBeInvalid(): R
      toBeValid(): R
      toBeRequired(): R
      toHaveDescription(description?: string | RegExp): R
      toHaveErrorMessage(message?: string | RegExp): R
    }
  }
}

export {}
