import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { mockFetchArtTypes } from '../../test/mocks/fetchArtTypesMock'
import Sidebar from '.'

// Mock API response
vi.mock('../../api/artwork_types_api', () => ({
  fetchArtTypes: mockFetchArtTypes,
}))

describe('Sidebar', () => {
  beforeEach(() => {
    localStorage.clear()
    mockFetchArtTypes.mockClear()
  })

  it('renders heading', () => {
    render(<Sidebar />)
    expect(screen.getByText('Artwork Types')).toBeInTheDocument()
  })

  it('fetches and displays all paginated Artwork Types', async () => {
    render(<Sidebar />)

    await waitFor(() => {
      expect(screen.getByText('Painting')).toBeInTheDocument()
      expect(screen.getByText('Sculpture')).toBeInTheDocument()
      expect(screen.getByText('Ceramics')).toBeInTheDocument()
      expect(screen.getByText('Digital Arts')).toBeInTheDocument()
    })

    // Ensure both pages were fetched
    expect(mockFetchArtTypes).toHaveBeenCalledWith(1)
    expect(mockFetchArtTypes).toHaveBeenCalledWith(2)
  })

  it('marks the first type in sorted Artwork Types as active by default', async () => {
    render(<Sidebar />)

    const firstType = await screen.findByText('Ceramics')
    expect(firstType).toHaveClass('active')
  })

  it('changes selected type on click', async () => {
    render(<Sidebar />)

    const ceramics = await screen.findByText('Sculpture')
    await userEvent.click(ceramics)

    expect(ceramics).toHaveClass('active')
  })

  it('displays an error message when API fails', async () => {
    mockFetchArtTypes.mockRejectedValueOnce(new Error('API failed'))

    render(<Sidebar />)

    await waitFor(() => {
      expect(
        screen.getByText('Failed to load art types. Please try again later.')
      ).toBeInTheDocument()
    })

    expect(mockFetchArtTypes).toHaveBeenCalled()
  })
})
