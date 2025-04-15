import './ArtworkDetail.css'
import '../../styles/shared.css'

import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { fetchSingleArtWork } from '../../api/single_artwork_api'
import { ArtWork } from '../../types/artwork'
import { stripHtml } from '../utils/utils'

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [artwork, setArtwork] = useState<ArtWork | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPublications, setShowPublications] = useState(false)
  const [showExhibitions, setShowExhibitions] = useState(false)
  const [showMaterials, setShowMaterials] = useState(false)
  const [showTechniques, setShowTechniques] = useState(false)
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const selectedType = params.get('type')
  const [isZoomed, setIsZoomed] = useState(false)
  const [imgSrc, setImgSrc] = useState<string>(
    `https://www.artic.edu/iiif/2/1/full/843,/0/default.jpg`
  )

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
            setImgSrc(
              `https://www.artic.edu/iiif/2/${parsed.data.image_id}/full/843,/0/default.jpg`
            )
            setLoading(false)
            return
          }
        }
        const response = await fetchSingleArtWork(id)
        setArtwork(response.data)
        setImgSrc(`https://www.artic.edu/iiif/2/${response.data.image_id}/full/843,/0/default.jpg`)
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
          <div
            className={`aic-artwork-image-wrapper ${isZoomed ? 'zoomed' : ''}`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <img
              className="aic-artwork-image"
              src={imgSrc}
              alt={artwork.title}
              onError={() => {
                if (!imgSrc.includes('600')) {
                  setImgSrc(
                    `https://www.artic.edu/iiif/2/${artwork.image_id}/full/600,/0/default.jpg`
                  )
                } else {
                  setImgSrc(
                    `https://www.artic.edu/iiif/2/${artwork.image_id}/full/400,/0/default.jpg`
                  )
                }
              }}
            />
          </div>
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
        {/* Collapsible: Publication History */}
        {artwork.publication_history && (
          <div className="aic-collapsible">
            <button onClick={() => setShowPublications((v) => !v)} className="aic-toggle">
              {showPublications ? '▼' : '▶'} Publication History
            </button>
            {showPublications && (
              <p className="aic-collapsible-content">{artwork.publication_history}</p>
            )}
          </div>
        )}

        {/* Collapsible: Exhibition History */}
        {artwork.exhibition_history && (
          <div className="aic-collapsible">
            <button onClick={() => setShowExhibitions((v) => !v)} className="aic-toggle">
              {showExhibitions ? '▼' : '▶'} Exhibition History
            </button>
            {showExhibitions && (
              <p className="aic-collapsible-content">{artwork.exhibition_history}</p>
            )}
          </div>
        )}

        {/* Collapsible: Material Titles */}
        {artwork.material_titles?.length > 0 && (
          <div className="aic-collapsible">
            <button onClick={() => setShowMaterials((v) => !v)} className="aic-toggle">
              {showMaterials ? '▼' : '▶'} Materials
            </button>
            {showMaterials && (
              <ul className="aic-collapsible-content">
                {artwork.material_titles.map((material, idx) => (
                  <li key={idx}>{material}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Collapsible: Technique Titles */}
        {artwork.technique_titles?.length > 0 && (
          <div className="aic-collapsible">
            <button onClick={() => setShowTechniques((v) => !v)} className="aic-toggle">
              {showTechniques ? '▼' : '▶'} Techniques
            </button>
            {showTechniques && (
              <ul className="aic-collapsible-content">
                {artwork.technique_titles.map((technique, idx) => (
                  <li key={idx}>{technique}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ArtworkDetail
