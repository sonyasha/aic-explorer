import './ArtworkDetail.css'
import '../../styles/shared.css'

import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { fetchSingleArtWork } from '../../api/single_artwork_api'
import { ArtWork } from '../../types/artwork'
import { stripHtml } from '../utils/utils'
import CollapsibleSection from './CollapsibleSection'
import ZoomableImage from './ZoomableImage'

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [artwork, setArtwork] = useState<ArtWork | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const selectedType = params.get('type')

  useEffect(() => {
    const loadArtwork = async () => {
      setLoading(true)
      try {
        if (!id) {
          throw new Error('Artwork ID is missing.')
        }
        const cacheKey = `artwork-${id}`
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          const parsed = JSON.parse(cached)
          const expired = Date.now() - parsed.timestamp > 1000 * 60 * 60 * 24

          if (!expired) {
            setArtwork(parsed.data)
            setLoading(false)
            return
          }
        }
        const response = await fetchSingleArtWork(id)
        setArtwork(response.data)
      } catch (err) {
        console.error('Failed to fetch artwork:', err)
        setError('An error occurred while fetching the artwork.')
      } finally {
        setLoading(false)
      }
    }
    loadArtwork()
  }, [id])

  if (loading) {
    return <div className="aic-loader">Loading artwork...</div>
  }
  if (error || !artwork) return <p className="aic-fetch-error">{error}</p>

  return (
    <div className="aic-artwork-detail">
      <div className="aic-artwork-header">
        <button onClick={() => navigate(`/?type=${selectedType}`)} className="aic-back-button">
          ← Back to Gallery
        </button>
        <div className="aic-artwork-subheader">{artwork.title}</div>
      </div>
      <div className="aic-artwork-context">
        {artwork.image_id && (
          <ZoomableImage
            src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
            alt={artwork.title}
            fallback600={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/600,/0/default.jpg`}
            fallback400={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/400,/0/default.jpg`}
          />
        )}
        <p>
          <strong>Artist:</strong> {artwork.artist_display}
        </p>
        <p>
          <strong>Date:</strong> {artwork.date_display}
        </p>
        <p>
          <strong>Medium:</strong> {artwork.medium_display}
        </p>
        <p>
          <strong>Description:</strong>{' '}
          {stripHtml(artwork.description || 'No description available.')}
        </p>
        {artwork.publication_history && (
          <CollapsibleSection title="Publication History" content={artwork.publication_history} />
        )}

        {artwork.exhibition_history && (
          <CollapsibleSection title="Exhibition History" content={artwork.exhibition_history} />
        )}

        {artwork.material_titles?.length > 0 && (
          <CollapsibleSection title="Materials" content={artwork.material_titles} isList />
        )}

        {artwork.technique_titles?.length > 0 && (
          <CollapsibleSection title="Techniques" content={artwork.technique_titles} isList />
        )}
      </div>
    </div>
  )
}

export default ArtworkDetail
