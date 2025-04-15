import { fireEvent,render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route,Routes } from 'react-router-dom'
import { beforeEach, describe, expect,it, vi } from 'vitest'

import ArtworkDetail from './index'

// 🧪 Mock the module dynamically using async to avoid hoisting issues
vi.mock('../../api/single_artwork_api', async () => {
  return {
    fetchSingleArtWork: vi.fn(async (id: string) => ({
      data: {
        id,
        title: 'Mock Artwork',
        artist_display: 'Mock Artist',
        date_display: '2024',
        medium_display: 'Oil on Canvas',
        image_id: 'mock-img',
        description: '<p>Mock description</p>',
        publication_history: 'Published in 2020',
        exhibition_history: 'Exhibited in 2021',
        material_titles: ['Oil Paint'],
        technique_titles: ['Brushwork'],
      },
    })),
  }
})

const renderWithRouter = (id = '123', search = '?type=5') => {
  return render(
    <MemoryRouter initialEntries={[`/art/${id}${search}`]}>
      <Routes>
        <Route path="/art/:id" element={<ArtworkDetail />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ArtworkDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('shows loading state initially', async () => {
    renderWithRouter()
    expect(screen.getByText('Loading artwork...')).toBeInTheDocument()
  })

  it('renders artwork data when fetch succeeds', async () => {
    renderWithRouter()

    await waitFor(() => {
      expect(screen.getByText('Mock Artwork')).toBeInTheDocument()
    })

    expect(screen.getByText('Mock Artist')).toBeInTheDocument()
    expect(screen.getByText('2024')).toBeInTheDocument()
    expect(screen.getByText('Oil on Canvas')).toBeInTheDocument()
    expect(screen.getByText('Mock description')).toBeInTheDocument()
  })

  it('falls back to smaller image on error', async () => {
    renderWithRouter()
    const img = await screen.findByRole('img')
    fireEvent.error(img)

    await waitFor(() => {
      expect(img.getAttribute('src')).toContain('/600,/0/default.jpg')
    })
  })

  it('toggles collapsible sections', async () => {
    renderWithRouter()

    const pubToggle = await screen.findByRole('button', { name: /Publication History/i })
    fireEvent.click(pubToggle)
    expect(screen.getByText('Published in 2020')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Exhibition History/i }))
    expect(screen.getByText('Exhibited in 2021')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Materials/i }))
    expect(screen.getByText('Oil Paint')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Techniques/i }))
    expect(screen.getByText('Brushwork')).toBeInTheDocument()
  })
})
