import { vi } from 'vitest'

export const mockFetch = vi.fn()

// Ensure we're mocking the global fetch
global.fetch = mockFetch as unknown as typeof fetch

// No need for the conditional since we're directly setting global.fetch
vi.spyOn(global, 'fetch').mockImplementation(mockFetch)
