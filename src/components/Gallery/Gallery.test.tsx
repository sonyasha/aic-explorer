import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchArtWorks } from '../../api/artwork_api'
import type { ArtWorkApiResponse } from '../../types/artwork'
import Gallery from './index'

// 🧪 Mock the fetchArtWorks function
vi.mock('../../api/artwork_api', () => ({
  fetchArtWorks: vi.fn(),
}))

const mockedFetch = fetchArtWorks as unknown as ReturnType<typeof vi.fn>

describe('Gallery component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  const mockResponse: ArtWorkApiResponse = {
    data: [
      {
        id: 1,
        title: 'Test Art',
        artist_display: 'Test Artist',
        date_display: '2024',
        image_id: 'image123',
      },
    ],
    pagination: {
      total: 2,
      limit: 1,
      offset: 0,
      total_pages: 2,
      current_page: 1,
      next_url: 'https://example.com/next',
      prev_url: null,
    },
    info: {
      license_text: 'asdf',
      license_links: [],
      version: 'asdf',
    },
    config: {
      iiif_url: 'www',
      website_url: 'www',
    },
  }

  const renderWithRouter = (component: React.ReactNode) =>
    render(<MemoryRouter>{component}</MemoryRouter>)

  it('renders without crashing', async () => {
    mockedFetch.mockResolvedValueOnce(mockResponse)

    renderWithRouter(<Gallery selectedType={1} />)

    await waitFor(() => {
      expect(screen.getByText('Test Art')).toBeInTheDocument()
    })
  })

  it('wraps each artwork in a link to its detail page', async () => {
    mockedFetch.mockResolvedValueOnce(mockResponse)

    renderWithRouter(<Gallery selectedType={1} />)

    const link = await screen.findByRole('link', { name: /Test Art/i })
    expect(link).toHaveAttribute('href', '/art/1?type=1')
  })

  it('displays an error message when fetch fails', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('API error'))

    renderWithRouter(<Gallery selectedType={1} />)

    await waitFor(() =>
      expect(
        screen.getByText('Failed to load artworks. Please try again later.')
      ).toBeInTheDocument()
    )
  })

  it('disables "Load More" button while loading', async () => {
    mockedFetch.mockResolvedValue(mockResponse)

    renderWithRouter(<Gallery selectedType={1} />)

    const button = await screen.findByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(button).toBeDisabled()
    })
  })
})
