import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { mockFetchArtTypes } from '../../test/mocks/fetchArtTypesMock'
import Sidebar from '.'

// Mock API response
vi.mock('../../api/artwork_types_api', () => ({
  fetchArtTypes: mockFetchArtTypes,
}))

describe('Sidebar component', () => {
  const defaultProps = {
    selectedType: null,
    onSelectType: vi.fn(),
    visible: true,
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mockFetchArtTypes.mockClear()
  })

  it('renders the list of artwork types', async () => {
    render(<Sidebar {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Painting')).toBeInTheDocument()
      expect(screen.getByText('Sculpture')).toBeInTheDocument()
      expect(screen.getByText('Ceramics')).toBeInTheDocument()
      expect(screen.getByText('Digital Arts')).toBeInTheDocument()
    })

    // Ensure API was called for both pages
    expect(mockFetchArtTypes).toHaveBeenCalledWith(1)
    expect(mockFetchArtTypes).toHaveBeenCalledWith(2)
  })

  // it('marks the first type as active when none is selected', async () => {
  //   let selectedType: number | null = null

  //   const onSelectType = vi.fn()

  //   const { rerender } = render(
  //     <Sidebar
  //       selectedType={selectedType}
  //       onSelectType={onSelectType}
  //       visible
  //       onClose={vi.fn()}
  //     />
  //   )

  //   await waitFor(() => {
  //     // Expect the handler to have been called
  //     expect(onSelectType).toHaveBeenCalledWith(expect.any(Number))
  //   })

  //   // Simulate updated prop after internal state sets it
  //   rerender(
  //     <Sidebar
  //       selectedType={selectedType}
  //       onSelectType={onSelectType}
  //       visible
  //       onClose={vi.fn()}
  //     />
  //   )

  //   const activeItem = await screen.findByText('Ceramics') // First in sorted list
  //   expect(activeItem).toHaveClass('active')
  // })

  it('calls onSelectType and onClose on click (mobile)', async () => {
    // Properly mock mobile screen width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    })

    const onSelectType = vi.fn()
    const onClose = vi.fn()

    render(<Sidebar selectedType={2} onSelectType={onSelectType} onClose={onClose} visible />)

    const target = await screen.findByText('Painting')
    await userEvent.click(target)

    expect(onSelectType).toHaveBeenCalledWith(expect.any(Number))
    expect(onClose).toHaveBeenCalled()
  })

  it('displays error when API fails', async () => {
    mockFetchArtTypes.mockRejectedValueOnce(new Error('API failed'))

    render(<Sidebar {...defaultProps} />)

    await waitFor(() => {
      expect(
        screen.getByText('Failed to load art types. Please try again later.')
      ).toBeInTheDocument()
    })
  })
})

// describe('Sidebar', () => {
//   beforeEach(() => {
//     localStorage.clear()
//     mockFetchArtTypes.mockClear()
//   })

//   it('renders heading', () => {
//     render(<Sidebar {...defaultProps} />)
//     expect(screen.getByText('Artwork Types')).toBeInTheDocument()
//   })

//   it('fetches and displays all paginated Artwork Types', async () => {
//     render(<Sidebar {...defaultProps} />)

//     await waitFor(() => {
//       expect(screen.getByText('Painting')).toBeInTheDocument()
//       expect(screen.getByText('Sculpture')).toBeInTheDocument()
//       expect(screen.getByText('Ceramics')).toBeInTheDocument()
//       expect(screen.getByText('Digital Arts')).toBeInTheDocument()
//     })

//     // Ensure both pages were fetched
//     expect(mockFetchArtTypes).toHaveBeenCalledWith(1)
//     expect(mockFetchArtTypes).toHaveBeenCalledWith(2)
//   })

//   it('marks the first type in sorted Artwork Types as active by default', async () => {
//     render(<Sidebar {...defaultProps} />)

//     const firstType = await screen.findByText('Ceramics')
//     expect(firstType).toHaveClass('active')
//   })

//   it('changes selected type on click', async () => {
//     render(<Sidebar {...defaultProps} />)

//     const ceramics = await screen.findByText('Sculpture')
//     await userEvent.click(ceramics)

//     expect(ceramics).toHaveClass('active')
//   })

//   it('displays an error message when API fails', async () => {
//     mockFetchArtTypes.mockRejectedValueOnce(new Error('API failed'))

//     render(<Sidebar {...defaultProps} />)

//     await waitFor(() => {
//       expect(
//         screen.getByText('Failed to load art types. Please try again later.')
//       ).toBeInTheDocument()
//     })

//     expect(mockFetchArtTypes).toHaveBeenCalled()
//   })
// })
