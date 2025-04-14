import './Gallery.css'

import { useEffect, useState } from 'react'

import { fetchArtWorks } from '../../api/artwork_api'
import { ArtWork } from '../../types/artwork'

interface GalleryProps {
  selectedType: number | null
}

const Gallery: React.FC<GalleryProps> = ({ selectedType }) => {
  //   const [error, setError] = useState<string | null>(null)
  const [artworks, setArtworks] = useState<ArtWork[]>([])
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
      const data = await fetchArtWorks(page, selectedType)
      if (data && data.data.length > 0) {
        setArtworks((prev) => [...prev, ...data.data])
        setHasMore(data.pagination.total_pages > page)
      } else {
        setHasMore(false)
      }
      setLoading(false)
    }
    loadArtworks()
  }, [selectedType, page])

  return (
    <div className="aic-gallery-container">
      <div className="aic-gallery">
        {artworks.map((artwork) => (
          <div className="aic-gallery-card" key={`art-${artwork.id}`}>
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
          </div>
        ))}
        {hasMore && (
          <button
            className="aic-load-more-button"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
            style={{
              marginTop: '1.5rem',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
            }}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </div>
  )
}

export default Gallery
