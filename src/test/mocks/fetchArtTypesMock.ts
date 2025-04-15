import { vi } from 'vitest'

import { ArtTypeApiResponse } from '../../types/arttype'

export const mockFetchArtTypes = vi.fn((page: number) => {
  const responses: Record<number, ArtTypeApiResponse> = {
    1: {
      pagination: {
        total_pages: 2,
        total: 4,
        offset: 0,
        limit: 2,
        current_page: 1,
        next_url: null,
        prev_url: null,
      },
      data: [
        { id: 1, title: 'Painting', aat_id: 36453 },
        { id: 2, title: 'Sculpture', aat_id: 63452 },
      ],
    },
    2: {
      pagination: {
        total_pages: 2,
        total: 4,
        offset: 2,
        limit: 2,
        current_page: 2,
        next_url: null,
        prev_url: null,
      },
      data: [
        { id: 3, title: 'Ceramics', aat_id: 93235 },
        { id: 4, title: 'Digital Arts', aat_id: 11037 },
      ],
    },
  }

  return Promise.resolve(responses[page] ?? responses[1])
})
