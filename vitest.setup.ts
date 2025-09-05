// Pour éviter les erreurs de type "Property 'vi' does not exist on type 'typeof globalThis'"
// @ts-ignore
globalThis.vi = vi
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: vi.fn(),
      reload: vi.fn(),
      back: vi.fn(),
      prefetch: vi.fn().mockResolvedValue(undefined),
    }
  },
}))

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock window.matchMedia - vérifier que window existe d'abord
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

// Mock global objects
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock PointerEvent pour motion-dom
globalThis.PointerEvent = class PointerEvent extends Event {
  constructor(type: string, options?: any) {
    super(type, options)
  }
  pointerId = 0
  width = 1
  height = 1
  pressure = 0
  tangentialPressure = 0
  tiltX = 0
  tiltY = 0
  twist = 0
  pointerType = 'mouse'
  isPrimary = true
} as any

// Mock SVG imports
vi.mock('*.svg', () => ({
  default: 'svg-mock',
  ReactComponent: vi.fn(() => 'SVG'),
}))

vi.mock('*.svg?react', () => ({
  default: vi.fn(() => 'SVG'),
}))
