import './Gallery.css'
import '../../styles/shared.css'

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { fetchArtWorks } from '../../api/artwork_api'
import { SimpleArtWork } from '../../types/artwork'

interface GalleryProps {
  selectedType: number | null
}

const Gallery: React.FC<GalleryProps> = ({ selectedType }) => {
  const [error, setError] = useState<string | null>(null)
  const [artworks, setArtworks] = useState<SimpleArtWork[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setArtworks([])
    setPage(1)
    setHasMore(true)
  }, [selectedType])

  useEffect(() => {
    const loadArtworks = async () => {
      setLoading(true)
      try {
        const cacheKey = `artworks-${selectedType}-${page}`
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          const parsed = JSON.parse(cached)
          const expired = Date.now() - parsed.timestamp > 1000 * 60 * 60 * 24

          if (!expired) {
            setArtworks((prev) => [...prev, ...parsed.data])
            setHasMore(true)
            setLoading(false)
            return
          }
        }

        const data = await fetchArtWorks(page, selectedType)
        if (data && data.data.length > 0) {
          setArtworks((prev) => [...prev, ...data.data])
          setHasMore(data.pagination.total_pages > page)

          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: data.data,
              timestamp: Date.now(),
            })
          )
        } else {
          setHasMore(false)
        }
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch artworks:', error)
        setError('Failed to load artworks. Please try again later.')
        setLoading(false)
      }
    }
    loadArtworks()
  }, [selectedType, page])

  return (
    <div className="aic-gallery-container">
      <div className="aic-gallery">
        {error && <p className="aic-fetch-error">{error}</p>}
        {artworks.map((artwork) => (
          <Link
            to={`/art/${artwork.id}?type=${selectedType}`}
            key={`art-${artwork.id}`}
            className="aic-gallery-card"
          >
            {artwork.image_id ? (
              <img
                className="aic-card-image"
                src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/250,/0/default.jpg`}
                alt={artwork.title}
              />
            ) : (
              <div className="aic-card-image" style={{ background: '#eee' }} />
            )}
            <div className="aic-card-content">
              <h3>{artwork.title}</h3>
              <p>{artwork.artist_display}</p>
              <p>{artwork.date_display} </p>
            </div>
          </Link>
        ))}
        {hasMore && (
          <button
            className="aic-load-more-button"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </div>
  )
}

export default Gallery
