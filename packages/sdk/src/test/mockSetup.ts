import { vi } from 'vitest'

export const mockFetch = vi.fn()

vi.mock('node-fetch', () => ({
  default: mockFetch
}))
